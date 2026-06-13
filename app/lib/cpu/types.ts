// lib/cpu/types.ts — CPU Scheduling isolated types

export type CpuAlgorithm = 'fcfs' | 'sjf' | 'priority' | 'rr';

export interface CpuProcess {
  name: string;
  arrival: number;
  burst: number;
  priority: number;
}

export interface GanttBlock {
  name: string;
  start: number;
  end: number;
}

export interface CpuStatRow extends CpuProcess {
  completion: number;
  turnaround: number;
  waiting: number;
}

export interface CpuStats {
  rows: CpuStatRow[];
  avgWaiting: string;
  avgTurnaround: string;
}

export interface CpuSimResult {
  gantt: GanttBlock[];
  stats: CpuStats;
}
