/* =============================================================
   [JS-06] SCREEN NAVIGATION
============================================================== */
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active-screen'));
    screens[screenName].classList.add('active-screen');
}

function openAlgorithmSelect(mode) {
    selectedMode = mode;

    if (mode === 'play') {
        algorithmTitle.textContent = 'CHOOSE PLAY STAGE';
        algorithmSubtitle.textContent = 'Choose which allocation rule you want to challenge yourself with.';
    } else {
        algorithmTitle.textContent = 'CHOOSE SIMULATION';
        algorithmSubtitle.textContent = 'Choose which algorithm the system will run automatically.';
    }

    showScreen('algorithm');
}


function openSimulationCompactionSetup(algorithm) {
    selectedAlgorithm = algorithm;
    simulationSetupSubtitle.textContent = `${getAlgorithmLabel(algorithm)} selected. Choose whether compaction is allowed for this simulation run.`;
    showScreen('simulationCompaction');
}


function openPlayStageTypeSetup(algorithm) {
    selectedAlgorithm = algorithm;
    playStageSetupSubtitle.textContent = `${getAlgorithmLabel(algorithm)} selected. Choose Easy, Normal, or Hard memory size.`;
    showScreen('playStageType');
}

function getStageLabel(stageType) {
    if (stageType === 'easy') return 'EASY — 1 GB';
    if (stageType === 'normal') return 'NORMAL — 2 GB';
    if (stageType === 'hard') return 'HARD — 3 GB';
    return 'UNKNOWN STAGE';
}

function getPlayMemoryProfile(stageType) {
    return PLAY_MEMORY_PROFILES[stageType] || PLAY_MEMORY_PROFILES.easy;
}

/* =============================================================
   [JS-07] RESET / START SHARED RUN
============================================================== */
function resetRun(memoryTemplate = STARTING_MEMORY) {
    memory = cloneMemory(memoryTemplate);
    processQueue = [];
    processedProcesses = [];
    unprocessedProcesses = [];
    hearts = MAX_HEARTS;
    score = 0;
    generatedProcessCount = 0;
    isRoundLocked = false;
    pendingCompactionContext = null;
    stopTimer();
    stopSimulationAutoRun();

    fillQueue();
}

function cloneMemory(source) {
    return JSON.parse(JSON.stringify(source));
}

/* =============================================================
   [JS-08] PROCESS QUEUE SYSTEM
   Queue is visible, but only the FIRST process is active.
   After placement/timeout, the next process moves up.
============================================================== */
function createRandomProcess() {
    const template = PROCESS_POOL[Math.floor(Math.random() * PROCESS_POOL.length)];
    generatedProcessCount++;

    return {
        id: generatedProcessCount,
        name: template.name,
        size: template.size
    };
}

function fillQueue() {
    while (processQueue.length < QUEUE_SIZE && generatedProcessCount < MAX_PROCESSES_PER_RUN) {
        processQueue.push(createRandomProcess());
    }
}

function getCurrentProcess() {
    return processQueue[0] || null;
}

function moveCurrentToUnprocessed(reason) {
    const current = processQueue.shift();
    if (current) {
        unprocessedProcesses.push({ ...current, reason });
    }
    fillQueue();
}

function moveCurrentToProcessed(blockIndex) {
    const current = processQueue.shift();
    if (current) {
        processedProcesses.push({ ...current, blockIndex });
    }
    fillQueue();
}

/* =============================================================
   [JS-09] RENDERING — PROCESS QUEUE
============================================================== */
function renderQueue(container) {
    container.innerHTML = '';

    if (processQueue.length === 0) {
        container.innerHTML = '<div class="queue-card">No queued processes left.</div>';
        return;
    }

    processQueue.forEach((process, index) => {
        const card = document.createElement('div');
        card.className = 'queue-card';
        if (index === 0) card.classList.add('active-queue-card');

        card.innerHTML = `
            <strong>${index === 0 ? 'CURRENT' : 'NEXT'}: ${process.name}</strong>
            <span>${process.size} MB</span>
        `;

        container.appendChild(card);
    });
}

/* =============================================================
   [JS-10] RENDERING — MEMORY BLOCKS
   A block can be FREE or USED.
   When allocation leaves leftover memory, a new FREE block is inserted.
============================================================== */
function renderMemory(container, clickable) {
    container.innerHTML = '';

    memory.forEach((block, index) => {
        const div = document.createElement('div');
        div.className = 'memory-block';
        div.dataset.index = index;

        if (block.used) {
            div.classList.add('used');
            div.innerHTML = `
                <strong>USED</strong>
                <span>${block.processName}</span>
                <span>${block.usedSize} MB</span>
            `;
        } else {
            div.classList.add('free');
            div.innerHTML = `
                <strong>FREE</strong>
                <span>${block.size} MB</span>
            `;

            if (clickable) {
                div.addEventListener('click', () => handlePlayBlockClick(index));
            }
        }

        container.appendChild(div);
    });
}

/* =============================================================
   [JS-13] PLAY MODE START / UI UPDATE
============================================================== */
function startPlayMode(algorithm, stageType = selectedStageType || 'easy') {
    selectedAlgorithm = algorithm;
    selectedStageType = stageType;
    resetRun(getPlayMemoryProfile(stageType));

    playStageLabel.textContent = getAlgorithmLabel(algorithm) + ' / ' + getStageLabel(stageType);
    playRuleText.textContent = getAlgorithmRule(algorithm);
    playMessage.textContent = 'Click the correct block before the timer ends.';

    showScreen('play');
    updatePlayUI();
    startTimer();
}

function updatePlayUI() {
    const current = getCurrentProcess();
    currentProcessText.textContent = current ? `${current.name} — ${current.size} MB` : 'NO PROCESS LEFT';

    heartDisplay.textContent = '♥ '.repeat(hearts).trim();
    if (hearts <= 0) heartDisplay.textContent = 'NO HEARTS';

    playScore.textContent = score;
    processedCount.textContent = processedProcesses.length;
    unprocessedCount.textContent = unprocessedProcesses.length;

    renderQueue(playQueueDisplay);
    renderMemory(playMemoryBlocks, true);
}

/* =============================================================
   [JS-14] PLAY MODE TIMER
   Player has 3 seconds. If time runs out, current process is
   moved to unprocessed and player loses 1 heart.
============================================================== */
function startTimer() {
    stopTimer();

    if (!getCurrentProcess()) {
        endRun('RUN COMPLETE');
        return;
    }

    timerRemaining = TIME_LIMIT_SECONDS;
    updateTimerUI();

    timerInterval = setInterval(() => {
        timerRemaining -= 0.1;
        updateTimerUI();

        if (timerRemaining <= 0) {
            handleTimeout();
        }
    }, 100);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerUI() {
    const display = Math.max(0, Math.ceil(timerRemaining));
    timerText.textContent = display;

    const percent = Math.max(0, (timerRemaining / TIME_LIMIT_SECONDS) * 100);
    timerBar.style.width = percent + '%';

    if (percent <= 30) {
        timerBar.style.background = 'var(--danger)';
    } else if (percent <= 60) {
        timerBar.style.background = 'var(--yellow)';
    } else {
        timerBar.style.background = 'var(--success)';
    }
}

function handleTimeout() {
    stopTimer();
    hearts--;
    moveCurrentToUnprocessed('Timed out');
    playMessage.textContent = 'TIME OUT! Process moved to unprocessed. -1 heart.';

    if (hearts <= 0) {
        updatePlayUI();
        endRun('GAME OVER');
        return;
    }

    if (shouldEndBecauseNoProcessesLeft()) {
        updatePlayUI();
        endRun('RUN COMPLETE');
        return;
    }

    updatePlayUI();
    startTimer();
}

/* =============================================================
   [JS-15] PLAY MODE BLOCK CLICK
   Correct block = allocation.
   Wrong block = lose heart.
============================================================== */
function handlePlayBlockClick(clickedIndex) {
    if (isRoundLocked) return;

    const current = getCurrentProcess();
    if (!current) {
        endRun('RUN COMPLETE');
        return;
    }

    const targetIndex = findTargetBlock(current, selectedAlgorithm);

    if (targetIndex === -1) {
        stopTimer();

        // [JS-15A] PLAY MODE MEMORY CHECK BEFORE COMPACTION PROMPT
        // Only ask for compaction if compaction can actually help.
        // If total free memory is smaller than the current process size,
        // the process cannot fit even after compaction, so the game ends.
        if (canCompactionHelp(current)) {
            openCompactionModal('play');
        } else {
            endPlayBecauseCompactionCannotHelp(current);
        }
        return;
    }

    if (clickedIndex !== targetIndex) {
        hearts--;
        score = Math.max(0, score - 5);
        flashMemoryBlock(clickedIndex, 'wrong-flash');
        playMessage.textContent = 'Wrong block! -1 heart. Follow the algorithm rule.';
        updatePlayUI();

        if (hearts <= 0) {
            stopTimer();
            endRun('GAME OVER');
        }
        return;
    }

    stopTimer();
    isRoundLocked = true;

    allocateProcessToBlock(current, clickedIndex);
    moveCurrentToProcessed(clickedIndex);
    score += 10;

    playMessage.textContent = 'Correct allocation! +10 score.';
    updatePlayUI();
    flashMemoryBlock(clickedIndex, 'correct-flash');

    setTimeout(() => {
        isRoundLocked = false;

        if (shouldEndBecauseNoProcessesLeft()) {
            endRun('RUN COMPLETE');
            return;
        }

        const next = getCurrentProcess();
        if (next && findTargetBlock(next, selectedAlgorithm) === -1) {
            stopTimer();

            // [JS-15B] AFTER ALLOCATION MEMORY CHECK
            // Same rule: prompt compaction only when total free memory is enough.
            // Otherwise, end immediately because compaction cannot solve it.
            if (canCompactionHelp(next)) {
                openCompactionModal('play');
            } else {
                endPlayBecauseCompactionCannotHelp(next);
            }
            return;
        }

        startTimer();
    }, 650);
}

function flashMemoryBlock(index, className) {
    const blocks = playMemoryBlocks.querySelectorAll('.memory-block');
    if (blocks[index]) {
        blocks[index].classList.add(className);
        setTimeout(() => blocks[index].classList.remove(className), 500);
    }
}

/* =============================================================
   [JS-17] COMPACTION MODAL BUTTON ACTIONS
============================================================== */
function confirmCompaction() {
    closeCompactionModal();
    compactMemory();

    if (pendingCompactionContext === 'play') {
        playMessage.textContent = 'Memory compacted. Continue quickly!';
        updatePlayUI();
        startTimer();
    }

    // Simulation mode never uses this Play compaction modal.
    // Simulation compaction behavior is chosen before the run starts.

    pendingCompactionContext = null;
}

function declineCompaction() {
    closeCompactionModal();

    if (pendingCompactionContext === 'play') {
        hearts--;
        moveCurrentToUnprocessed('Declined compaction');
        playMessage.textContent = 'Compaction declined. Current process unprocessed. -1 heart.';
        updatePlayUI();

        if (hearts <= 0) {
            endRun('GAME OVER');
        } else {
            startTimer();
        }
    }

    // Simulation mode does not open this modal.

    pendingCompactionContext = null;
}

/* =============================================================
   [JS-18] SIMULATION MODE START / UI UPDATE
============================================================== */
function startSimulationMode(algorithm, useCompaction) {
    selectedAlgorithm = algorithm;
    simulationUseCompaction = useCompaction;
    resetRun(STARTING_MEMORY);

    simulationStageLabel.textContent = getAlgorithmLabel(algorithm) + ' AUTO';
    simulationMessage.textContent = 'Press STEP to place the current process automatically.';
    simulationAlgorithmInfo.textContent = getAlgorithmRule(algorithm);
    simulationCompactionInfo.textContent = useCompaction
        ? 'Compaction: ON — simulator compacts automatically only when needed.'
        : 'Compaction: OFF — simulation stops when the process cannot fit.';

    showScreen('simulation');
    updateSimulationUI();
}

function updateSimulationUI() {
    const current = getCurrentProcess();
    simulationProcessText.textContent = current ? `${current.name} — ${current.size} MB` : 'NO PROCESS LEFT';
    renderQueue(simulationQueueDisplay);
    renderMemory(simulationMemoryBlocks, false);
}

/* =============================================================
   [JS-19] SIMULATION STEP / AUTO RUN
   Simulation mode never opens a compaction alert.
   If WITH COMPACTION was chosen, compaction happens automatically
   only when the selected algorithm cannot fit the current process
   but total free memory is enough.
   If NO COMPACTION was chosen, it stops and shows results.
============================================================== */
function simulationStep() {
    const current = getCurrentProcess();

    if (!current) {
        endRun('SIMULATION COMPLETE');
        return;
    }

    let targetIndex = findTargetBlock(current, selectedAlgorithm);

    if (targetIndex === -1) {
        if (simulationUseCompaction && getTotalFreeMemory() >= current.size) {
            compactMemory();
            targetIndex = findTargetBlock(current, selectedAlgorithm);
            simulationMessage.textContent = 'Compaction applied automatically, then the algorithm tried again.';
        }
    }

    if (targetIndex === -1) {
        stopSimulationBecauseNoMemory(current);
        return;
    }

    allocateProcessToBlock(current, targetIndex);
    moveCurrentToProcessed(targetIndex);

    if (!simulationMessage.textContent.includes('Compaction applied')) {
        simulationMessage.textContent = `${getAlgorithmLabel(selectedAlgorithm)} placed process automatically.`;
    }
    updateSimulationUI();

    if (shouldEndBecauseNoProcessesLeft()) {
        endRun('SIMULATION COMPLETE');
    }
}

function stopSimulationBecauseNoMemory(process) {
    stopSimulationAutoRun();
    moveCurrentToUnprocessed(`${getAlgorithmLabel(selectedAlgorithm)} could not find a valid block`);
    simulationMessage.textContent = `Simulation stopped. ${process.name} could not fit. Try another algorithm.`;
    updateSimulationUI();
    endRun('SIMULATION STOPPED — NO MEMORY FIT');
}

function toggleSimulationAutoRun() {
    if (simulationAutoInterval) {
        stopSimulationAutoRun();
        simulationMessage.textContent = 'Auto run stopped.';
        return;
    }

    simulationMessage.textContent = 'Auto run started.';
    simulationAutoButton.textContent = 'STOP AUTO';

    simulationAutoInterval = setInterval(() => {
        if (!getCurrentProcess()) {
            stopSimulationAutoRun();
            endRun('SIMULATION COMPLETE');
            return;
        }

        simulationStep();
    }, 900);
}

function stopSimulationAutoRun() {
    if (simulationAutoInterval) {
        clearInterval(simulationAutoInterval);
        simulationAutoInterval = null;
    }
    simulationAutoButton.textContent = 'AUTO RUN';
}

/* =============================================================
   [JS-20] END GAME / RESULTS SYSTEM
   Better end game: shows processed and unprocessed process lists.
============================================================== */
function shouldEndBecauseNoProcessesLeft() {
    return processQueue.length === 0 && generatedProcessCount >= MAX_PROCESSES_PER_RUN;
}

function endRun(title) {
    stopTimer();
    stopSimulationAutoRun();

    // Anything still in queue becomes unprocessed at the end.
    while (processQueue.length > 0) {
        const process = processQueue.shift();
        unprocessedProcesses.push({ ...process, reason: 'Left in queue at end' });
    }

    resultsTitle.textContent = title;

    const total = processedProcesses.length + unprocessedProcesses.length;
    const tryMessage = title.includes('SIMULATION STOPPED')
        ? '<p><strong>Suggestion:</strong> Try another algorithm or use optional compaction before the block becomes impossible.</p>'
        : '';

    resultsSummary.innerHTML = `
        <p><strong>Algorithm:</strong> ${getAlgorithmLabel(selectedAlgorithm)}</p>
        <p><strong>Play Stage Type:</strong> ${selectedMode === 'play' ? getStageLabel(selectedStageType) : 'N/A'}</p>
        <p><strong>Simulation Compaction:</strong> ${selectedMode === 'simulation' ? (simulationUseCompaction ? 'WITH COMPACTION' : 'NO COMPACTION') : 'N/A'}</p>
        <p><strong>Processed:</strong> ${processedProcesses.length} / ${total}</p>
        <p><strong>Unprocessed:</strong> ${unprocessedProcesses.length} / ${total}</p>
        <p><strong>Score:</strong> ${score}</p>
        <p><strong>Hearts Left:</strong> ${hearts}</p>
        ${tryMessage}
    `;

    processedList.innerHTML = processedProcesses.length
        ? processedProcesses.map(p => `<div class="result-item">${p.name} — ${p.size} MB</div>`).join('')
        : '<div class="result-item">None</div>';

    unprocessedList.innerHTML = unprocessedProcesses.length
        ? unprocessedProcesses.map(p => `<div class="result-item">${p.name} — ${p.size} MB<br><small>${p.reason}</small></div>`).join('')
        : '<div class="result-item">None</div>';

    resultsModal.classList.remove('hidden');
}

function closeResultsModal() {
    resultsModal.classList.add('hidden');
}

/* =============================================================
   [JS-21] EVENT LISTENERS — SCREEN BUTTONS
============================================================== */
startButton.addEventListener('click', () => showScreen('topic'));
openPlaySelectButton.addEventListener('click', () => openAlgorithmSelect('play'));
openSimSelectButton.addEventListener('click', () => openAlgorithmSelect('simulation'));
modeBackButton.addEventListener('click', () => showScreen('topic'));
algorithmBackButton.addEventListener('click', () => showScreen('mode'));

/* =============================================================
   [JS-21A] EVENT LISTENERS — TOPIC SELECT SCREEN
   Memory Allocation keeps the existing Play/Simulation flow.
   The other topics jump straight to their algorithm select screen.
============================================================== */
topicBackButton.addEventListener('click', () => showScreen('opening'));

document.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', () => {
        const topic = card.dataset.topic;

        if (topic === 'memory') {
            showScreen('mode');
        } else if (topic === 'cpu') {
            showScreen('cpuAlgorithm');
        } else if (topic === 'vm') {
            showScreen('vmAlgorithm');
        } else if (topic === 'disk') {
            showScreen('diskAlgorithm');
        }
    });
});

/* =============================================================
   [JS-22] EVENT LISTENERS — ALGORITHM CARDS
============================================================== */
document.querySelectorAll('.algorithm-card').forEach(card => {
    card.addEventListener('click', () => {
        const algorithm = card.dataset.algorithm;

        if (selectedMode === 'play') {
            openPlayStageTypeSetup(algorithm);
        } else {
            openSimulationCompactionSetup(algorithm);
        }
    });
});

/* =============================================================
   [JS-22A] EVENT LISTENERS — PLAY STAGE TYPE CARDS
   Required play flow: START -> PLAY -> ALGORITHM -> STAGE TYPE.
============================================================== */
document.querySelectorAll('.stage-type-card').forEach(card => {
    card.addEventListener('click', () => {
        const stageType = card.dataset.stageType;
        startPlayMode(selectedAlgorithm, stageType);
    });
});

playStageBackButton.addEventListener('click', () => openAlgorithmSelect('play'));

/* =============================================================
   [JS-23] EVENT LISTENERS — PLAY MODE CONTROLS
============================================================== */
playExitButton.addEventListener('click', () => {
    stopTimer();
    showScreen('mode');
});

playRestartButton.addEventListener('click', () => startPlayMode(selectedAlgorithm, selectedStageType));

playCompactButton.addEventListener('click', () => {
    stopTimer();
    openCompactionModal('play');
});

/* =============================================================
   [JS-24] EVENT LISTENERS — SIMULATION CONTROLS
============================================================== */
simulationExitButton.addEventListener('click', () => {
    stopSimulationAutoRun();
    showScreen('mode');
});

simulationStepButton.addEventListener('click', simulationStep);
simulationAutoButton.addEventListener('click', toggleSimulationAutoRun);

// [JS-24A] Simulation setup buttons: choose compaction behavior before the run starts.
simWithCompactionButton.addEventListener('click', () => startSimulationMode(selectedAlgorithm, true));
simNoCompactionButton.addEventListener('click', () => startSimulationMode(selectedAlgorithm, false));
simSetupBackButton.addEventListener('click', () => openAlgorithmSelect('simulation'));

/* =============================================================
   [JS-25] EVENT LISTENERS — MODALS
============================================================== */
confirmCompactionButton.addEventListener('click', confirmCompaction);
declineCompactionButton.addEventListener('click', declineCompaction);

resultsRestartButton.addEventListener('click', () => {
    closeResultsModal();

    if (selectedMode === 'play') {
        startPlayMode(selectedAlgorithm, selectedStageType);
    } else {
        startSimulationMode(selectedAlgorithm, simulationUseCompaction);
    }
});

resultsTryAlgorithmButton.addEventListener('click', () => {
    closeResultsModal();

    if (selectedMode === 'play') {
        openAlgorithmSelect('play');
    } else {
        selectedMode = 'simulation';
        openAlgorithmSelect('simulation');
    }
});

resultsMenuButton.addEventListener('click', () => {
    closeResultsModal();
    showScreen('mode');
});

/* =============================================================
   [JS-32] EVENT LISTENERS — NEW TOPIC SCREENS
============================================================== */
// CPU Scheduling
cpuAlgoBackButton.addEventListener('click', () => showScreen('topic'));
document.querySelectorAll('[data-cpu-algo]').forEach(card => {
    card.addEventListener('click', () => startCpuMode(card.dataset.cpuAlgo));
});
cpuStepButton.addEventListener('click', cpuStep);
cpuAutoButton.addEventListener('click', toggleCpuAutoRun);
cpuRestartButton.addEventListener('click', () => startCpuMode(cpuAlgorithm));
cpuExitButton.addEventListener('click', () => {
    stopCpuAutoRun();
    showScreen('topic');
});

// Virtual Memory
vmAlgoBackButton.addEventListener('click', () => showScreen('topic'));
document.querySelectorAll('[data-vm-algo]').forEach(card => {
    card.addEventListener('click', () => startVmMode(card.dataset.vmAlgo));
});
vmStepButton.addEventListener('click', vmStep);
vmAutoButton.addEventListener('click', toggleVmAutoRun);
vmRestartButton.addEventListener('click', () => startVmMode(vmAlgorithm));
vmExitButton.addEventListener('click', () => {
    stopVmAutoRun();
    showScreen('topic');
});

// Disk Scheduling
diskAlgoBackButton.addEventListener('click', () => showScreen('topic'));
document.querySelectorAll('[data-disk-algo]').forEach(card => {
    card.addEventListener('click', () => startDiskMode(card.dataset.diskAlgo));
});
diskStepButton.addEventListener('click', diskStep);
diskAutoButton.addEventListener('click', toggleDiskAutoRun);
diskRestartButton.addEventListener('click', () => startDiskMode(diskAlgorithm));
diskExitButton.addEventListener('click', () => {
    stopDiskAutoRun();
    showScreen('topic');
});
