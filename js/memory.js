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

