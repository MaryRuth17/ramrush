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
