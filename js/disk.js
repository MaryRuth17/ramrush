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
