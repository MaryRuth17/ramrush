/* =============================================================
   RAM RUSH v11 — SCRIPT.JS
   This file controls the GAME LOGIC.

   EDITING GUIDE:
   - Change memory sizes in [JS-02]
   - Change process names/sizes in [JS-03]
   - Change timer length in [JS-04]
   - Change hearts in [JS-04]
   - Change algorithm behavior in [JS-11]
   - Change compaction in [JS-16]
   - Change simulation stop behavior in [JS-19]
============================================================== */

/* =============================================================
   [JS-01] DOM ELEMENT SHORTCUTS
   These connect JavaScript to HTML elements.
============================================================== */
const screens = {
    opening: document.getElementById('openingScreen'),
    topic: document.getElementById('topicScreen'),
    mode: document.getElementById('modeScreen'),
    algorithm: document.getElementById('algorithmScreen'),
    playStageType: document.getElementById('playStageTypeScreen'),
    play: document.getElementById('playScreen'),
    simulationCompaction: document.getElementById('simulationCompactionScreen'),
    simulation: document.getElementById('simulationScreen'),
    cpuAlgorithm: document.getElementById('cpuAlgorithmScreen'),
    cpu: document.getElementById('cpuScreen'),
    vmAlgorithm: document.getElementById('vmAlgorithmScreen'),
    vm: document.getElementById('vmScreen'),
    diskAlgorithm: document.getElementById('diskAlgorithmScreen'),
    disk: document.getElementById('diskScreen')
};

const startButton = document.getElementById('startButton');
const openPlaySelectButton = document.getElementById('openPlaySelectButton');
const openSimSelectButton = document.getElementById('openSimSelectButton');
const modeBackButton = document.getElementById('modeBackButton');
const algorithmBackButton = document.getElementById('algorithmBackButton');
const algorithmTitle = document.getElementById('algorithmTitle');
const algorithmSubtitle = document.getElementById('algorithmSubtitle');
const simulationSetupSubtitle = document.getElementById('simulationSetupSubtitle');
const playStageSetupSubtitle = document.getElementById('playStageSetupSubtitle');
const playStageBackButton = document.getElementById('playStageBackButton');
const simWithCompactionButton = document.getElementById('simWithCompactionButton');
const simNoCompactionButton = document.getElementById('simNoCompactionButton');
const simSetupBackButton = document.getElementById('simSetupBackButton');

const playStageLabel = document.getElementById('playStageLabel');
const heartDisplay = document.getElementById('heartDisplay');
const playScore = document.getElementById('playScore');
const processedCount = document.getElementById('processedCount');
const unprocessedCount = document.getElementById('unprocessedCount');
const currentProcessText = document.getElementById('currentProcessText');
const timerText = document.getElementById('timerText');
const timerBar = document.getElementById('timerBar');
const playQueueDisplay = document.getElementById('playQueueDisplay');
const playMemoryBlocks = document.getElementById('playMemoryBlocks');
const playRuleText = document.getElementById('playRuleText');
const playMessage = document.getElementById('playMessage');
const playCompactButton = document.getElementById('playCompactButton');
const playRestartButton = document.getElementById('playRestartButton');
const playExitButton = document.getElementById('playExitButton');

const simulationStageLabel = document.getElementById('simulationStageLabel');
const simulationProcessText = document.getElementById('simulationProcessText');
const simulationQueueDisplay = document.getElementById('simulationQueueDisplay');
const simulationMemoryBlocks = document.getElementById('simulationMemoryBlocks');
const simulationStepButton = document.getElementById('simulationStepButton');
const simulationAutoButton = document.getElementById('simulationAutoButton');
const simulationAlgorithmInfo = document.getElementById('simulationAlgorithmInfo');
const simulationCompactionInfo = document.getElementById('simulationCompactionInfo');
const simulationExitButton = document.getElementById('simulationExitButton');
const simulationMessage = document.getElementById('simulationMessage');

const compactionModal = document.getElementById('compactionModal');
const compactionModalText = document.getElementById('compactionModalText');
const confirmCompactionButton = document.getElementById('confirmCompactionButton');
const declineCompactionButton = document.getElementById('declineCompactionButton');

const resultsModal = document.getElementById('resultsModal');
const resultsTitle = document.getElementById('resultsTitle');
const resultsSummary = document.getElementById('resultsSummary');
const processedList = document.getElementById('processedList');
const unprocessedList = document.getElementById('unprocessedList');
const resultsRestartButton = document.getElementById('resultsRestartButton');
const resultsTryAlgorithmButton = document.getElementById('resultsTryAlgorithmButton');
const resultsMenuButton = document.getElementById('resultsMenuButton');

/* =============================================================
   [JS-01B] DOM ELEMENT SHORTCUTS — NEW TOPICS
   CPU Scheduling, Virtual Memory, Disk Scheduling.
============================================================== */
const topicBackButton = document.getElementById('topicBackButton');

const cpuAlgoBackButton = document.getElementById('cpuAlgoBackButton');
const cpuStageLabel = document.getElementById('cpuStageLabel');
const cpuProcessTable = document.getElementById('cpuProcessTable');
const cpuGanttChart = document.getElementById('cpuGanttChart');
const cpuResultsTable = document.getElementById('cpuResultsTable');
const cpuStepButton = document.getElementById('cpuStepButton');
const cpuAutoButton = document.getElementById('cpuAutoButton');
const cpuRestartButton = document.getElementById('cpuRestartButton');
const cpuAlgorithmInfo = document.getElementById('cpuAlgorithmInfo');
const cpuMessage = document.getElementById('cpuMessage');
const cpuExitButton = document.getElementById('cpuExitButton');

const vmAlgoBackButton = document.getElementById('vmAlgoBackButton');
const vmStageLabel = document.getElementById('vmStageLabel');
const vmReferenceRow = document.getElementById('vmReferenceRow');
const vmFrames = document.getElementById('vmFrames');
const vmResultsTable = document.getElementById('vmResultsTable');
const vmStepButton = document.getElementById('vmStepButton');
const vmAutoButton = document.getElementById('vmAutoButton');
const vmRestartButton = document.getElementById('vmRestartButton');
const vmAlgorithmInfo = document.getElementById('vmAlgorithmInfo');
const vmMessage = document.getElementById('vmMessage');
const vmExitButton = document.getElementById('vmExitButton');

const diskAlgoBackButton = document.getElementById('diskAlgoBackButton');
const diskStageLabel = document.getElementById('diskStageLabel');
const diskRequestRow = document.getElementById('diskRequestRow');
const diskTrackLine = document.getElementById('diskTrackLine');
const diskOrderRow = document.getElementById('diskOrderRow');
const diskResultsTable = document.getElementById('diskResultsTable');
const diskStepButton = document.getElementById('diskStepButton');
const diskAutoButton = document.getElementById('diskAutoButton');
const diskRestartButton = document.getElementById('diskRestartButton');
const diskAlgorithmInfo = document.getElementById('diskAlgorithmInfo');
const diskMessage = document.getElementById('diskMessage');
const diskExitButton = document.getElementById('diskExitButton');

/* =============================================================
   [JS-02] STARTING MEMORY BLOCKS
   These are the blocks shown at the start.
   The game SPLITS a block when leftover memory remains.
============================================================== */
const STARTING_MEMORY = [
    { size: 120, used: false, processName: null, usedSize: 0 },
    { size: 200, used: false, processName: null, usedSize: 0 },
    { size: 300, used: false, processName: null, usedSize: 0 },
    { size: 150, used: false, processName: null, usedSize: 0 },
    { size: 250, used: false, processName: null, usedSize: 0 }
];

/* =============================================================
   [JS-02A] PLAY MODE STAGE MEMORY PROFILES
   These are used ONLY in Play Mode.
   Simulation still uses STARTING_MEMORY and is not changed.

   EASY   = 1 GB = 1024 MB total memory
   NORMAL = 2 GB = 2048 MB total memory
   HARD   = 3 GB = 3072 MB total memory
============================================================== */
const PLAY_MEMORY_PROFILES = {
    easy: [
        { size: 128, used: false, processName: null, usedSize: 0 },
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 }
    ],
    normal: [
        { size: 256, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 384, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 }
    ],
    hard: [
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 512, used: false, processName: null, usedSize: 0 },
        { size: 768, used: false, processName: null, usedSize: 0 },
        { size: 640, used: false, processName: null, usedSize: 0 },
        { size: 640, used: false, processName: null, usedSize: 0 }
    ]
};

/* =============================================================
   [JS-03] PROCESS POOL
   Realistic process names. Edit this list to add/remove processes.
   size = memory requirement in MB.
============================================================== */
const PROCESS_POOL = [
    { name: 'chrome.exe', size: 180 },
    { name: 'discord.exe', size: 95 },
    { name: 'spotify.exe', size: 80 },
    { name: 'code.exe', size: 140 },
    { name: 'photoshop.exe', size: 260 },
    { name: 'steam.exe', size: 210 },
    { name: 'valorant.exe', size: 280 },
    { name: 'blender.exe', size: 240 },
    { name: 'obs64.exe', size: 160 },
    { name: 'teams.exe', size: 130 },
    { name: 'notepad.exe', size: 40 },
    { name: 'python.exe', size: 115 },
    { name: 'xampp.exe', size: 170 },
    { name: 'figma.exe', size: 155 },
    { name: 'unity.exe', size: 290 },
    { name: 'explorer.exe', size: 60 }
];

/* =============================================================
   [JS-04] GAME SETTINGS
   TIME_LIMIT_SECONDS = how long player has to think.
   MAX_HEARTS = player life count.
   QUEUE_SIZE = visible process queue size.
   MAX_PROCESSES_PER_RUN = better end condition: run ends after this many
   total processes are generated, then unprocessed are shown.
============================================================== */
const TIME_LIMIT_SECONDS = 3;
const MAX_HEARTS = 4;
const QUEUE_SIZE = 4;
const MAX_PROCESSES_PER_RUN = 14;

/* =============================================================
   [JS-05] GAME STATE
   These variables change while the game runs.
============================================================== */
let selectedMode = null;          // 'play' or 'simulation'
let selectedAlgorithm = null;     // 'firstFit', 'bestFit', or 'worstFit'
let selectedStageType = null;      // Play only: 'easy', 'normal', or 'hard'
let simulationUseCompaction = false; // true only if user selects WITH COMPACTION before simulation starts

let memory = [];
let processQueue = [];
let processedProcesses = [];
let unprocessedProcesses = [];

let hearts = MAX_HEARTS;
let score = 0;
let generatedProcessCount = 0;
let isRoundLocked = false;

let timerInterval = null;
let timerRemaining = TIME_LIMIT_SECONDS;

let simulationAutoInterval = null;
let pendingCompactionContext = null; // Play mode only for automatic prompts. Simulation compaction is optional button only.

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
   [JS-11] ALGORITHM TARGET FINDERS
   These return the index of the block that should be chosen.
============================================================== */
function findTargetBlock(process, algorithm) {
    if (!process) return -1;

    if (algorithm === 'firstFit') {
        return findFirstFit(process);
    }

    if (algorithm === 'bestFit') {
        return findBestFit(process);
    }

    if (algorithm === 'worstFit') {
        return findWorstFit(process);
    }

    return -1;
}

function findFirstFit(process) {
    for (let i = 0; i < memory.length; i++) {
        if (!memory[i].used && memory[i].size >= process.size) {
            return i;
        }
    }
    return -1;
}

function findBestFit(process) {
    let bestIndex = -1;
    let smallestLeftover = Infinity;

    for (let i = 0; i < memory.length; i++) {
        if (!memory[i].used && memory[i].size >= process.size) {
            const leftover = memory[i].size - process.size;
            if (leftover < smallestLeftover) {
                smallestLeftover = leftover;
                bestIndex = i;
            }
        }
    }

    return bestIndex;
}

function findWorstFit(process) {
    let worstIndex = -1;
    let largestBlock = -1;

    for (let i = 0; i < memory.length; i++) {
        if (!memory[i].used && memory[i].size >= process.size) {
            if (memory[i].size > largestBlock) {
                largestBlock = memory[i].size;
                worstIndex = i;
            }
        }
    }

    return worstIndex;
}

function getAlgorithmLabel(algorithm) {
    if (algorithm === 'firstFit') return 'FIRST FIT';
    if (algorithm === 'bestFit') return 'BEST FIT';
    if (algorithm === 'worstFit') return 'WORST FIT';
    return 'UNKNOWN';
}

function getAlgorithmRule(algorithm) {
    if (algorithm === 'firstFit') return 'Click the FIRST free block that is large enough.';
    if (algorithm === 'bestFit') return 'Click the SMALLEST free block that is still large enough.';
    if (algorithm === 'worstFit') return 'Click the LARGEST free block available.';
    return '';
}

/* =============================================================
   [JS-12] ALLOCATION WITH BLOCK SPLITTING
   This brings back the first-version system:
   FREE 300 + process 180 -> USED 180 + FREE 120
============================================================== */
function allocateProcessToBlock(process, blockIndex) {
    const block = memory[blockIndex];
    const leftover = block.size - process.size;

    block.used = true;
    block.processName = process.name;
    block.usedSize = process.size;
    block.size = process.size;

    if (leftover > 0) {
        memory.splice(blockIndex + 1, 0, {
            size: leftover,
            used: false,
            processName: null,
            usedSize: 0
        });
    }
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
   [JS-16] COMPACTION SYSTEM
   Compaction combines all FREE memory and places it after all USED blocks.
   This is called from a modal when memory is full/fragmented.
============================================================== */
function openCompactionModal(context) {
    pendingCompactionContext = context;
    const current = getCurrentProcess();
    const totalFree = getTotalFreeMemory();

    compactionModalText.textContent = current
        ? `No single block can fit ${current.name} (${current.size} MB). Total free memory: ${totalFree} MB. Use compaction?`
        : 'No current process. Use compaction?';

    compactionModal.classList.remove('hidden');
}

function closeCompactionModal() {
    compactionModal.classList.add('hidden');
}

function compactMemory() {
    const usedBlocks = memory.filter(block => block.used);
    const totalFree = getTotalFreeMemory();

    memory = usedBlocks;

    if (totalFree > 0) {
        memory.push({
            size: totalFree,
            used: false,
            processName: null,
            usedSize: 0
        });
    }
}

function getTotalFreeMemory() {
    return memory
        .filter(block => !block.used)
        .reduce((sum, block) => sum + block.size, 0);
}

function canCompactionHelp(process) {
    // [JS-16A] CAN COMPACTION HELP?
    // Compaction can help only if the total FREE memory is equal to or larger
    // than the process size. If this is false, no prompt should appear.
    return process && getTotalFreeMemory() >= process.size;
}

function endPlayBecauseCompactionCannotHelp(process) {
    // [JS-16B] PLAY MODE DIRECT END WHEN MEMORY IS TRULY INSUFFICIENT
    // This prevents the game from asking for compaction when compaction cannot work.
    if (process) {
        moveCurrentToUnprocessed('Not enough total free memory, even after compaction');
    }

    playMessage.textContent = 'GAME OVER: Not enough total free memory. Compaction cannot help.';
    updatePlayUI();
    endRun('GAME OVER — MEMORY EXHAUSTED');
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
   [JS-26] CPU SCHEDULING — DATA & ALGORITHMS
   Each algorithm returns a "Gantt chart": an array of
   { name, start, end } slices in the order they run.
============================================================== */
const CPU_PROCESSES_TEMPLATE = [
    { name: 'P1', arrival: 0, burst: 5, priority: 3 },
    { name: 'P2', arrival: 1, burst: 3, priority: 1 },
    { name: 'P3', arrival: 2, burst: 8, priority: 4 },
    { name: 'P4', arrival: 3, burst: 6, priority: 2 },
    { name: 'P5', arrival: 4, burst: 4, priority: 5 }
];
const CPU_QUANTUM = 2;

let cpuAlgorithm = null;
let cpuGantt = [];
let cpuRevealed = 0;
let cpuAutoInterval = null;

function getCpuAlgoLabel(algorithm) {
    if (algorithm === 'fcfs') return 'FCFS';
    if (algorithm === 'sjf') return 'SJF';
    if (algorithm === 'priority') return 'PRIORITY';
    if (algorithm === 'rr') return 'ROUND ROBIN';
    return 'UNKNOWN';
}

function getCpuAlgoInfo(algorithm) {
    if (algorithm === 'fcfs') return 'First Come First Served: processes run in the order they arrive, one after another.';
    if (algorithm === 'sjf') return 'Shortest Job First (non-preemptive): among arrived processes, the one with the smallest burst time runs next.';
    if (algorithm === 'priority') return 'Priority Scheduling (non-preemptive): among arrived processes, the one with the lowest priority number runs next.';
    if (algorithm === 'rr') return `Round Robin: each process gets a time slice of ${CPU_QUANTUM} units, then goes to the back of the queue if it still has work left.`;
    return '';
}

function computeCpuGantt(algorithm) {
    const processes = CPU_PROCESSES_TEMPLATE.map(p => ({ ...p }));

    if (algorithm === 'fcfs') {
        const order = [...processes].sort((a, b) => a.arrival - b.arrival);
        let time = 0;

        return order.map(p => {
            const start = Math.max(time, p.arrival);
            const end = start + p.burst;
            time = end;
            return { name: p.name, start, end };
        });
    }

    if (algorithm === 'sjf' || algorithm === 'priority') {
        const remaining = processes.map(p => ({ ...p }));
        let time = 0;
        const gantt = [];

        while (remaining.length > 0) {
            const arrived = remaining.filter(p => p.arrival <= time);

            if (arrived.length === 0) {
                time = Math.min(...remaining.map(p => p.arrival));
                continue;
            }

            const next = algorithm === 'sjf'
                ? arrived.reduce((a, b) => (b.burst < a.burst ? b : a))
                : arrived.reduce((a, b) => (b.priority < a.priority ? b : a));

            const start = time;
            const end = start + next.burst;
            gantt.push({ name: next.name, start, end });
            time = end;

            remaining.splice(remaining.indexOf(next), 1);
        }

        return gantt;
    }

    if (algorithm === 'rr') {
        const remaining = processes.map(p => ({ ...p, left: p.burst }));
        const added = new Array(remaining.length).fill(false);
        const queue = [];
        let time = 0;
        const gantt = [];

        function addArrived() {
            remaining.forEach((p, i) => {
                if (!added[i] && p.arrival <= time) {
                    queue.push(i);
                    added[i] = true;
                }
            });
        }

        addArrived();
        if (queue.length === 0) {
            time = Math.min(...remaining.map(p => p.arrival));
            addArrived();
        }

        while (queue.length > 0) {
            const i = queue.shift();
            const p = remaining[i];
            const run = Math.min(CPU_QUANTUM, p.left);
            const start = time;
            time += run;
            p.left -= run;
            gantt.push({ name: p.name, start, end: time });

            addArrived();
            if (p.left > 0) queue.push(i);

            if (queue.length === 0 && remaining.some(r => r.left > 0)) {
                const waiting = remaining
                    .map((r, idx) => ({ r, idx }))
                    .filter(({ r, idx }) => r.left > 0 && !added[idx]);

                if (waiting.length > 0) {
                    time = Math.max(time, Math.min(...waiting.map(w => w.r.arrival)));
                    addArrived();
                }
            }
        }

        return gantt;
    }

    return [];
}

function computeCpuStats(gantt) {
    const completion = {};
    CPU_PROCESSES_TEMPLATE.forEach(p => { completion[p.name] = 0; });
    gantt.forEach(block => { completion[block.name] = block.end; });

    let totalWaiting = 0;
    let totalTurnaround = 0;

    const rows = CPU_PROCESSES_TEMPLATE.map(p => {
        const turnaround = completion[p.name] - p.arrival;
        const waiting = turnaround - p.burst;
        totalWaiting += waiting;
        totalTurnaround += turnaround;
        return { ...p, completion: completion[p.name], turnaround, waiting };
    });

    const n = CPU_PROCESSES_TEMPLATE.length;
    return {
        rows,
        avgWaiting: (totalWaiting / n).toFixed(2),
        avgTurnaround: (totalTurnaround / n).toFixed(2)
    };
}

/* =============================================================
   [JS-27] CPU SCHEDULING — RENDER & CONTROLS
============================================================== */
function startCpuMode(algorithm) {
    cpuAlgorithm = algorithm;
    cpuGantt = computeCpuGantt(algorithm);
    cpuRevealed = 0;
    stopCpuAutoRun();

    cpuStageLabel.textContent = getCpuAlgoLabel(algorithm);
    cpuAlgorithmInfo.textContent = getCpuAlgoInfo(algorithm);
    cpuMessage.textContent = 'Press STEP to build the Gantt chart, one slice at a time.';
    cpuResultsTable.innerHTML = 'Run the scheduler to see results.';

    renderCpuProcessTable();
    renderCpuGantt();
    showScreen('cpu');
}

function renderCpuProcessTable() {
    cpuProcessTable.innerHTML = CPU_PROCESSES_TEMPLATE.map(p => `
        <div class="queue-card">
            <strong>${p.name}</strong>
            <span>Arrival: ${p.arrival}</span>
            <span>Burst: ${p.burst}</span>
            <span>Priority: ${p.priority}</span>
        </div>
    `).join('');
}

function renderCpuGantt() {
    if (cpuRevealed === 0) {
        cpuGanttChart.innerHTML = '<div class="gantt-block"><strong>—</strong><span>No slices yet</span></div>';
        return;
    }

    cpuGanttChart.innerHTML = cpuGantt.slice(0, cpuRevealed).map(block => `
        <div class="gantt-block">
            <strong>${block.name}</strong>
            <span>${block.start} - ${block.end}</span>
        </div>
    `).join('');
}

function cpuStep() {
    if (cpuRevealed >= cpuGantt.length) {
        cpuMessage.textContent = 'Scheduler already finished. Press RESTART to run again.';
        stopCpuAutoRun();
        return;
    }

    cpuRevealed++;
    renderCpuGantt();

    const block = cpuGantt[cpuRevealed - 1];
    cpuMessage.textContent = `${block.name} runs from time ${block.start} to ${block.end}.`;

    if (cpuRevealed === cpuGantt.length) {
        stopCpuAutoRun();
        showCpuResults();
    }
}

function showCpuResults() {
    const stats = computeCpuStats(cpuGantt);

    cpuResultsTable.innerHTML = `
        <table class="results-table">
            <tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th><th>Completion</th><th>Turnaround</th><th>Waiting</th></tr>
            ${stats.rows.map(r => `
                <tr>
                    <td>${r.name}</td><td>${r.arrival}</td><td>${r.burst}</td><td>${r.priority}</td>
                    <td>${r.completion}</td><td>${r.turnaround}</td><td>${r.waiting}</td>
                </tr>
            `).join('')}
        </table>
        <p style="margin-top:8px;color:var(--yellow);">
            Average Waiting Time: ${stats.avgWaiting} &nbsp;|&nbsp; Average Turnaround Time: ${stats.avgTurnaround}
        </p>
    `;

    cpuMessage.textContent = `${getCpuAlgoLabel(cpuAlgorithm)} complete. See results below.`;
}

function toggleCpuAutoRun() {
    if (cpuAutoInterval) {
        stopCpuAutoRun();
        cpuMessage.textContent = 'Auto run stopped.';
        return;
    }

    cpuAutoButton.textContent = 'STOP AUTO';
    cpuAutoInterval = setInterval(() => {
        if (cpuRevealed >= cpuGantt.length) {
            stopCpuAutoRun();
            return;
        }
        cpuStep();
    }, 700);
}

function stopCpuAutoRun() {
    if (cpuAutoInterval) {
        clearInterval(cpuAutoInterval);
        cpuAutoInterval = null;
    }
    cpuAutoButton.textContent = 'AUTO RUN';
}

/* =============================================================
   [JS-28] VIRTUAL MEMORY — DATA & ALGORITHMS
   Page replacement: FIFO, LRU, Optimal.
============================================================== */
const VM_REFERENCE_STRING = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
const VM_FRAME_COUNT = 3;

let vmAlgorithm = null;
let vmFrameSlots = [];
let vmFifoOrder = [];
let vmRecency = [];
let vmIndex = 0;
let vmFaults = 0;
let vmHits = 0;
let vmLog = [];
let vmAutoInterval = null;

function getVmAlgoLabel(algorithm) {
    if (algorithm === 'fifo') return 'FIFO';
    if (algorithm === 'lru') return 'LRU';
    if (algorithm === 'optimal') return 'OPTIMAL';
    return 'UNKNOWN';
}

function getVmAlgoInfo(algorithm) {
    if (algorithm === 'fifo') return 'FIFO: when a page must be replaced, remove the page that has been in memory the longest.';
    if (algorithm === 'lru') return 'LRU: when a page must be replaced, remove the page that was used least recently.';
    if (algorithm === 'optimal') return 'Optimal: when a page must be replaced, remove the page that will not be used again for the longest time (or never again).';
    return '';
}

function resetVmState() {
    vmFrameSlots = new Array(VM_FRAME_COUNT).fill(null);
    vmFifoOrder = [];
    vmRecency = new Array(VM_FRAME_COUNT).fill(-1);
    vmIndex = 0;
    vmFaults = 0;
    vmHits = 0;
    vmLog = [];
}

function startVmMode(algorithm) {
    vmAlgorithm = algorithm;
    resetVmState();
    stopVmAutoRun();

    vmStageLabel.textContent = getVmAlgoLabel(algorithm);
    vmAlgorithmInfo.textContent = getVmAlgoInfo(algorithm);
    vmMessage.textContent = 'Press STEP to process the next page reference.';
    vmResultsTable.innerHTML = 'Run the simulation to see page fault stats.';

    renderVmReference();
    renderVmFrames();
    showScreen('vm');
}

function renderVmReference() {
    vmReferenceRow.innerHTML = VM_REFERENCE_STRING.map((page, i) => {
        let className = 'ref-cell';
        if (i < vmLog.length) className += vmLog[i] === 'hit' ? ' hit' : ' fault';
        if (i === vmIndex) className += ' current';
        return `<div class="${className}">${page}</div>`;
    }).join('');
}

function renderVmFrames() {
    vmFrames.innerHTML = vmFrameSlots.map((page, i) => {
        if (page === null) {
            return `<div class="memory-block vm-frame empty"><strong>FRAME ${i + 1}</strong><span>EMPTY</span></div>`;
        }
        return `<div class="memory-block vm-frame filled"><strong>FRAME ${i + 1}</strong><span>PAGE ${page}</span></div>`;
    }).join('');
}

function findVmVictim() {
    if (vmAlgorithm === 'fifo') {
        return vmFifoOrder[0];
    }

    if (vmAlgorithm === 'lru') {
        let victim = 0;
        for (let i = 1; i < vmRecency.length; i++) {
            if (vmRecency[i] < vmRecency[victim]) victim = i;
        }
        return victim;
    }

    if (vmAlgorithm === 'optimal') {
        let victim = 0;
        let farthest = -1;

        for (let i = 0; i < vmFrameSlots.length; i++) {
            const page = vmFrameSlots[i];
            let next = VM_REFERENCE_STRING.indexOf(page, vmIndex + 1);
            if (next === -1) next = Infinity;

            if (next > farthest) {
                farthest = next;
                victim = i;
            }
        }

        return victim;
    }

    return 0;
}

function vmStep() {
    if (vmIndex >= VM_REFERENCE_STRING.length) {
        vmMessage.textContent = 'Reference string complete. Press RESTART to run again.';
        stopVmAutoRun();
        return;
    }

    const page = VM_REFERENCE_STRING[vmIndex];
    const frameIndex = vmFrameSlots.indexOf(page);

    if (frameIndex !== -1) {
        vmHits++;
        vmLog.push('hit');
        vmRecency[frameIndex] = vmIndex;
        vmMessage.textContent = `Page ${page} is already in Frame ${frameIndex + 1}. HIT.`;
    } else {
        vmFaults++;
        vmLog.push('fault');

        const emptySlot = vmFrameSlots.indexOf(null);

        if (emptySlot !== -1) {
            vmFrameSlots[emptySlot] = page;
            vmFifoOrder.push(emptySlot);
            vmRecency[emptySlot] = vmIndex;
            vmMessage.textContent = `Page ${page} loaded into empty Frame ${emptySlot + 1}. FAULT.`;
        } else {
            const victim = findVmVictim();
            const oldPage = vmFrameSlots[victim];
            vmFrameSlots[victim] = page;
            vmRecency[victim] = vmIndex;

            if (vmAlgorithm === 'fifo') {
                vmFifoOrder = vmFifoOrder.filter(f => f !== victim);
                vmFifoOrder.push(victim);
            }

            vmMessage.textContent = `Page ${page} replaces page ${oldPage} in Frame ${victim + 1}. FAULT.`;
        }
    }

    vmIndex++;
    renderVmReference();
    renderVmFrames();

    if (vmIndex >= VM_REFERENCE_STRING.length) {
        stopVmAutoRun();
        showVmResults();
    }
}

function showVmResults() {
    const total = VM_REFERENCE_STRING.length;
    const ratio = ((vmHits / total) * 100).toFixed(1);

    vmResultsTable.innerHTML = `
        <table class="results-table">
            <tr><th>Total References</th><th>Page Faults</th><th>Hits</th><th>Hit Ratio</th></tr>
            <tr><td>${total}</td><td>${vmFaults}</td><td>${vmHits}</td><td>${ratio}%</td></tr>
        </table>
    `;

    vmMessage.textContent = `${getVmAlgoLabel(vmAlgorithm)} complete. ${vmFaults} page faults out of ${total} references.`;
}

function toggleVmAutoRun() {
    if (vmAutoInterval) {
        stopVmAutoRun();
        vmMessage.textContent = 'Auto run stopped.';
        return;
    }

    vmAutoButton.textContent = 'STOP AUTO';
    vmAutoInterval = setInterval(() => {
        if (vmIndex >= VM_REFERENCE_STRING.length) {
            stopVmAutoRun();
            return;
        }
        vmStep();
    }, 700);
}

function stopVmAutoRun() {
    if (vmAutoInterval) {
        clearInterval(vmAutoInterval);
        vmAutoInterval = null;
    }
    vmAutoButton.textContent = 'AUTO RUN';
}

/* =============================================================
   [JS-30] DISK SCHEDULING — DATA & ALGORITHMS
   FCFS, SSTF, SCAN, C-SCAN, LOOK.
============================================================== */
const DISK_REQUESTS_TEMPLATE = [98, 183, 37, 122, 14, 124, 65, 67];
const DISK_HEAD_START = 53;
const DISK_MAX_TRACK = 199;

let diskAlgorithm = null;
let diskOrder = [];
let diskRevealed = 0;
let diskAutoInterval = null;

function getDiskAlgoLabel(algorithm) {
    if (algorithm === 'fcfs') return 'FCFS';
    if (algorithm === 'sstf') return 'SSTF';
    if (algorithm === 'scan') return 'SCAN';
    if (algorithm === 'cscan') return 'C-SCAN';
    if (algorithm === 'look') return 'LOOK';
    return 'UNKNOWN';
}

function getDiskAlgoInfo(algorithm) {
    if (algorithm === 'fcfs') return 'FCFS: service disk requests strictly in the order they arrive.';
    if (algorithm === 'sstf') return 'SSTF: always service the request closest to the current head position.';
    if (algorithm === 'scan') return 'SCAN: sweep toward higher tracks servicing requests, then reverse direction toward lower tracks.';
    if (algorithm === 'cscan') return 'C-SCAN: sweep toward higher tracks servicing requests, then jump back to track 0 and continue upward.';
    if (algorithm === 'look') return 'LOOK: like SCAN, but the head reverses at the last request instead of going to the end of the disk.';
    return '';
}

function computeDiskOrder(algorithm) {
    const reqs = [...DISK_REQUESTS_TEMPLATE];
    const head = DISK_HEAD_START;

    if (algorithm === 'fcfs') {
        return reqs;
    }

    if (algorithm === 'sstf') {
        const remaining = [...reqs];
        const order = [];
        let current = head;

        while (remaining.length > 0) {
            remaining.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
            const next = remaining.shift();
            order.push(next);
            current = next;
        }

        return order;
    }

    // SCAN / C-SCAN / LOOK all move toward higher tracks first.
    const greater = reqs.filter(r => r >= head).sort((a, b) => a - b);
    const lesser = reqs.filter(r => r < head).sort((a, b) => a - b);

    if (algorithm === 'cscan') {
        // After reaching the highest track, jump to 0 and continue upward.
        return [...greater, ...lesser];
    }

    // SCAN and LOOK: after the highest track, reverse direction downward.
    return [...greater, ...lesser.slice().reverse()];
}

function computeDiskMovement(order) {
    let total = 0;
    let current = DISK_HEAD_START;

    order.forEach(track => {
        total += Math.abs(track - current);
        current = track;
    });

    return total;
}

/* =============================================================
   [JS-31] DISK SCHEDULING — RENDER & CONTROLS
============================================================== */
function startDiskMode(algorithm) {
    diskAlgorithm = algorithm;
    diskOrder = computeDiskOrder(algorithm);
    diskRevealed = 0;
    stopDiskAutoRun();

    diskStageLabel.textContent = getDiskAlgoLabel(algorithm);
    diskAlgorithmInfo.textContent = getDiskAlgoInfo(algorithm);
    diskMessage.textContent = 'Press STEP to move the disk head to the next request.';
    diskResultsTable.innerHTML = 'Run the simulation to see total head movement.';

    renderDiskRequests();
    renderDiskOrder();
    renderDiskTrack();
    showScreen('disk');
}

function renderDiskRequests() {
    diskRequestRow.innerHTML = DISK_REQUESTS_TEMPLATE.map(track => `
        <div class="queue-card"><strong>REQUEST</strong><span>Track ${track}</span></div>
    `).join('');
}

function renderDiskOrder() {
    diskOrderRow.innerHTML = diskOrder.map((track, i) => {
        const visited = i < diskRevealed ? ' visited' : '';
        return `<div class="queue-card order-card${visited}"><strong>STEP ${i + 1}</strong><span>Track ${track}</span></div>`;
    }).join('');
}

function renderDiskTrack() {
    const currentPos = diskRevealed === 0 ? DISK_HEAD_START : diskOrder[diskRevealed - 1];
    const percent = track => (track / DISK_MAX_TRACK) * 100;

    let html = `<div class="disk-mark" style="left:${percent(DISK_HEAD_START)}%;background:var(--yellow);"><span>START ${DISK_HEAD_START}</span></div>`;

    DISK_REQUESTS_TEMPLATE.forEach(track => {
        const visited = diskOrder.slice(0, diskRevealed).includes(track) ? ' visited' : '';
        html += `<div class="disk-mark${visited}" style="left:${percent(track)}%;"><span>${track}</span></div>`;
    });

    html += `<div class="disk-head" style="left:${percent(currentPos)}%;"></div>`;

    diskTrackLine.innerHTML = html;
}

function diskStep() {
    if (diskRevealed >= diskOrder.length) {
        diskMessage.textContent = 'All requests serviced. Press RESTART to run again.';
        stopDiskAutoRun();
        return;
    }

    const prev = diskRevealed === 0 ? DISK_HEAD_START : diskOrder[diskRevealed - 1];
    const next = diskOrder[diskRevealed];
    diskRevealed++;

    renderDiskOrder();
    renderDiskTrack();

    diskMessage.textContent = `Head moves from track ${prev} to track ${next} (${Math.abs(next - prev)} tracks).`;

    if (diskRevealed === diskOrder.length) {
        stopDiskAutoRun();
        showDiskResults();
    }
}

function showDiskResults() {
    const total = computeDiskMovement(diskOrder);

    diskResultsTable.innerHTML = `
        <table class="results-table">
            <tr><th>Service Order</th><th>Total Head Movement</th></tr>
            <tr><td>${DISK_HEAD_START} &rarr; ${diskOrder.join(' &rarr; ')}</td><td>${total} tracks</td></tr>
        </table>
    `;

    diskMessage.textContent = `${getDiskAlgoLabel(diskAlgorithm)} complete. Total head movement: ${total} tracks.`;
}

function toggleDiskAutoRun() {
    if (diskAutoInterval) {
        stopDiskAutoRun();
        diskMessage.textContent = 'Auto run stopped.';
        return;
    }

    diskAutoButton.textContent = 'STOP AUTO';
    diskAutoInterval = setInterval(() => {
        if (diskRevealed >= diskOrder.length) {
            stopDiskAutoRun();
            return;
        }
        diskStep();
    }, 700);
}

function stopDiskAutoRun() {
    if (diskAutoInterval) {
        clearInterval(diskAutoInterval);
        diskAutoInterval = null;
    }
    diskAutoButton.textContent = 'AUTO RUN';
}

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
