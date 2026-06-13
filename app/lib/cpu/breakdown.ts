// lib/cpu/breakdown.ts — Step-by-step math breakdown for CPU Scheduling

import type { CpuAlgorithm, CpuProcess, GanttBlock, CpuStats } from './types';
import { getCpuAlgoLabel } from './algorithms';

export interface BreakdownStep {
  step: number;
  title: string;
  explanation: string;
  formula?: string;
}

export function generateCpuBreakdown(
  algorithm: CpuAlgorithm,
  gantt: GanttBlock[],
  stats: CpuStats,
  processes: CpuProcess[],
  quantum?: number
): BreakdownStep[] {
  const steps: BreakdownStep[] = [];

  steps.push({
    step: 1,
    title: 'Algorithm Overview',
    explanation: `The ${getCpuAlgoLabel(algorithm)} scheduling algorithm was applied to ${processes.length} process(es). ${getAlgorithmDescription(algorithm, quantum)}`,
  });

  steps.push({
    step: 2,
    title: 'Process Input Data',
    explanation:
      'Each process is defined by its arrival time (when it enters the ready queue) and burst time (how long it needs on the CPU). Priority scheduling also uses a priority number where a lower value indicates higher urgency.',
    formula: processes.map(p => `${p.name}: Arrival=${p.arrival}, Burst=${p.burst}, Priority=${p.priority}`).join(' | '),
  });

  steps.push({
    step: 3,
    title: 'Gantt Chart Execution Order',
    explanation: `The scheduler produced ${gantt.length} execution slice(s) in the following order. Each slice represents a continuous period of CPU time assigned to one process.`,
    formula: gantt.map(b => `${b.name} [${b.start}→${b.end}]`).join(' → '),
  });

  steps.push({
    step: 4,
    title: 'Completion Time Calculation',
    explanation:
      'Completion Time (CT) is the moment at which a process finishes its last execution slice on the CPU. For algorithms without preemption, this equals the end of its single Gantt block.',
    formula: stats.rows.map(r => `CT(${r.name}) = ${r.completion}`).join(', '),
  });

  steps.push({
    step: 5,
    title: 'Turnaround Time = Completion − Arrival',
    explanation:
      'Turnaround Time (TAT) measures the total elapsed time from when a process arrives in the system until it fully completes. It captures both waiting time and execution time combined.',
    formula: stats.rows.map(r => `TAT(${r.name}) = ${r.completion} − ${r.arrival} = ${r.turnaround}`).join(' | '),
  });

  steps.push({
    step: 6,
    title: 'Waiting Time = Turnaround − Burst',
    explanation:
      'Waiting Time (WT) isolates the time a process spent in the ready queue doing nothing. It equals Turnaround Time minus the actual CPU Burst Time. Minimising average waiting time is the primary optimisation goal of CPU scheduling algorithms.',
    formula: stats.rows.map(r => `WT(${r.name}) = ${r.turnaround} − ${r.burst} = ${r.waiting}`).join(' | '),
  });

  const n = stats.rows.length;
  const totalWT = stats.rows.reduce((s, r) => s + r.waiting, 0);
  const totalTAT = stats.rows.reduce((s, r) => s + r.turnaround, 0);

  steps.push({
    step: 7,
    title: 'Average Waiting Time',
    explanation:
      'The Average Waiting Time (AWT) is the arithmetic mean of all individual waiting times. A lower AWT generally indicates a more efficient scheduling policy for this specific workload.',
    formula: `AWT = (${stats.rows.map(r => r.waiting).join(' + ')}) ÷ ${n} = ${totalWT} ÷ ${n} = ${stats.avgWaiting}`,
  });

  steps.push({
    step: 8,
    title: 'Average Turnaround Time',
    explanation:
      'The Average Turnaround Time (ATAT) represents how long processes wait on average from entry to completion. It reflects the overall responsiveness of the system under the chosen scheduling algorithm.',
    formula: `ATAT = (${stats.rows.map(r => r.turnaround).join(' + ')}) ÷ ${n} = ${totalTAT} ÷ ${n} = ${stats.avgTurnaround}`,
  });

  return steps;
}

function getAlgorithmDescription(algorithm: CpuAlgorithm, quantum?: number): string {
  if (algorithm === 'fcfs')
    return 'First Come First Served is a non-preemptive algorithm that runs processes strictly in arrival order. Its simplicity comes at the cost of potentially high waiting times for short processes that arrive after long ones, a phenomenon known as the convoy effect.';
  if (algorithm === 'sjf')
    return 'Shortest Job First (non-preemptive) selects the process with the minimum burst time among all processes that have arrived by the current time. It is provably optimal for minimising average waiting time in a non-preemptive environment, but requires prior knowledge of burst durations.';
  if (algorithm === 'priority')
    return 'Priority Scheduling assigns the CPU to the highest-priority arrived process. Lower priority numbers indicate greater urgency in this implementation. When processes share equal priority, arrival order is used as a tiebreaker. This algorithm risks starvation of low-priority processes.';
  if (algorithm === 'rr')
    return `Round Robin allocates a fixed time quantum of ${quantum ?? 2} unit(s) to each process in cyclic order. After a process exhausts its quantum, it is placed at the end of the ready queue. This ensures fairness and bounded waiting time, making it well-suited for time-sharing systems.`;
  return '';
}
