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

