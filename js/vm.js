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

