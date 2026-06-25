import type { CpuAlgorithm, CpuProcess, GanttBlock, CpuStats, CpuStatRow } from './types';

export const DEFAULT_CPU_PROCESSES: CpuProcess[] = [
  { name: 'P1', arrival: 0, burst: 5, priority: 3 },
  { name: 'P2', arrival: 1, burst: 3, priority: 1 },
  { name: 'P3', arrival: 2, burst: 8, priority: 4 },
  { name: 'P4', arrival: 3, burst: 6, priority: 2 },
  { name: 'P5', arrival: 4, burst: 4, priority: 5 },
];

export const DEFAULT_CPU_QUANTUM = 2;

export function computeCpuGantt(
  algorithm: CpuAlgorithm,
  processes: CpuProcess[] = DEFAULT_CPU_PROCESSES,
  quantum: number = DEFAULT_CPU_QUANTUM
): GanttBlock[] {
  const procs = processes.map(p => ({ ...p }));

  if (algorithm === 'fcfs') {
    const order = [...procs].sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    return order.map((p, i) => {
      const start = Math.max(time, p.arrival);
      const end = start + p.burst;
      const idleNote = start > time && i > 0 ? ` CPU idle until t=${start}.` : '';
      time = end;
      const reason = `FCFS: position ${i + 1} in arrival order.${idleNote} ${p.name} (arrival: ${p.arrival}, burst: ${p.burst}).`;
      return { name: p.name, start, end, reason };
    });
  }

  if (algorithm === 'sjf' || algorithm === 'priority') {
    const remaining = procs.map(p => ({ ...p }));
    let time = 0;
    const gantt: GanttBlock[] = [];

    while (remaining.length > 0) {
      const arrived = remaining.filter(p => p.arrival <= time);
      if (arrived.length === 0) {
        time = Math.min(...remaining.map(p => p.arrival));
        continue;
      }
      let next: typeof arrived[0];
      let reason: string;
      if (algorithm === 'sjf') {
        next = arrived.reduce((a, b) => (b.burst < a.burst ? b : a));
        const readyStr = arrived.map(p => `${p.name}(burst:${p.burst})`).join(', ');
        reason = arrived.length === 1
          ? `SJF: at t=${time}, only ${next.name} has arrived (burst: ${next.burst}).`
          : `SJF: at t=${time}, ready — [${readyStr}]. ${next.name} has shortest burst (${next.burst}) → selected.`;
      } else {
        next = arrived.reduce((a, b) => (b.priority < a.priority ? b : a));
        const readyStr = arrived.map(p => `${p.name}(pri:${p.priority})`).join(', ');
        reason = arrived.length === 1
          ? `Priority: at t=${time}, only ${next.name} has arrived (priority: ${next.priority}).`
          : `Priority: at t=${time}, ready — [${readyStr}]. ${next.name} has highest priority (lowest number: ${next.priority}) → selected.`;
      }
      gantt.push({ name: next.name, start: time, end: time + next.burst, reason });
      time += next.burst;
      remaining.splice(remaining.indexOf(next), 1);
    }
    return gantt;
  }

  if (algorithm === 'rr') {
    const remaining = procs.map(p => ({ ...p, left: p.burst }));
    const added = new Array(remaining.length).fill(false);
    const queue: number[] = [];
    let time = 0;
    const gantt: GanttBlock[] = [];

    function addArrived() {
      remaining.forEach((p, i) => {
        if (!added[i] && p.arrival <= time) { queue.push(i); added[i] = true; }
      });
    }

    addArrived();
    if (queue.length === 0) {
      time = Math.min(...remaining.map(p => p.arrival));
      addArrived();
    }

    while (queue.length > 0) {
      const i = queue.shift()!;
      const p = remaining[i];
      const run = Math.min(quantum, p.left);
      const leftAfter = p.left - run;
      const reason = leftAfter > 0
        ? `RR: ${p.name} next in queue. Runs ${run}/${quantum}-unit quantum. ${leftAfter} burst unit(s) remaining — returns to back of queue.`
        : `RR: ${p.name} next in queue. Runs final ${run} unit(s) (burst: ${p.burst}). Process completes.`;
      gantt.push({ name: p.name, start: time, end: time + run, reason });
      time += run;
      p.left -= run;
      addArrived();
      if (p.left > 0) queue.push(i);
      if (queue.length === 0 && remaining.some(r => r.left > 0)) {
        const waiting = remaining.map((r, idx) => ({ r, idx })).filter(({ r, idx }) => r.left > 0 && !added[idx]);
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

export function computeCpuStats(
  gantt: GanttBlock[],
  processes: CpuProcess[] = DEFAULT_CPU_PROCESSES
): CpuStats {
  const completion: Record<string, number> = {};
  processes.forEach(p => { completion[p.name] = 0; });
  gantt.forEach(b => { completion[b.name] = b.end; });

  let totalWaiting = 0;
  let totalTurnaround = 0;

  const rows: CpuStatRow[] = processes.map(p => {
    const turnaround = completion[p.name] - p.arrival;
    const waiting = turnaround - p.burst;
    totalWaiting += waiting;
    totalTurnaround += turnaround;
    return { ...p, completion: completion[p.name], turnaround, waiting };
  });

  const n = processes.length;
  return {
    rows,
    avgWaiting: (totalWaiting / n).toFixed(2),
    avgTurnaround: (totalTurnaround / n).toFixed(2),
  };
}

export function getCpuAlgoLabel(algorithm: CpuAlgorithm): string {
  const labels: Record<CpuAlgorithm, string> = {
    fcfs: 'FCFS', sjf: 'SJF', priority: 'PRIORITY', rr: 'ROUND ROBIN',
  };
  return labels[algorithm] ?? 'UNKNOWN';
}

export function getCpuAlgoInfo(algorithm: CpuAlgorithm, quantum = DEFAULT_CPU_QUANTUM): string {
  if (algorithm === 'fcfs') return 'First Come First Served: processes run in the order they arrive, one after another, without any preemption.';
  if (algorithm === 'sjf') return 'Shortest Job First (non-preemptive): among all arrived processes, the one with the smallest burst time is scheduled next.';
  if (algorithm === 'priority') return 'Priority Scheduling (non-preemptive): among all arrived processes, the one with the lowest priority number is scheduled next. Lower number means higher urgency.';
  if (algorithm === 'rr') return `Round Robin: each process receives a time quantum of ${quantum} units. When its quantum expires, it is placed at the back of the ready queue, and the next process runs.`;
  return '';
}

/** Returns the name of the process that should run next given current time */
export function getNextCpuProcess(
  algorithm: CpuAlgorithm,
  processes: CpuProcess[],
  completedNames: string[],
  currentTime: number,
  quantum: number = DEFAULT_CPU_QUANTUM
): string | null {
  const remaining = processes.filter(p => !completedNames.includes(p.name) && p.arrival <= currentTime);
  if (remaining.length === 0) return null;
  if (algorithm === 'fcfs') return remaining.reduce((a, b) => a.arrival <= b.arrival ? a : b).name;
  if (algorithm === 'sjf') return remaining.reduce((a, b) => b.burst < a.burst ? b : a).name;
  if (algorithm === 'priority') return remaining.reduce((a, b) => b.priority < a.priority ? b : a).name;
  // RR — return first in arrived order not yet completed
  return remaining[0].name;
}
