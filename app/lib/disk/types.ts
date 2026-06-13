// lib/disk/types.ts — Disk Scheduling isolated types

export type DiskAlgorithm = 'fcfs' | 'sstf' | 'scan' | 'cscan' | 'look';

export interface DiskSimResult {
  order: number[];
  movements: number[];
  totalMovement: number;
  headStart: number;
  requests: number[];
}
