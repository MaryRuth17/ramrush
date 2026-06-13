// lib/vm/types.ts — Virtual Memory isolated types

export type VmAlgorithm = 'fifo' | 'lru' | 'optimal';

export type VmLogEntry = 'hit' | 'fault';

export interface VmStepState {
  frameSlots: (number | null)[];
  log: VmLogEntry;
  message: string;
  victimFrame?: number;
  loadedPage: number;
}

export interface VmSimResult {
  steps: VmStepState[];
  faults: number;
  hits: number;
  hitRatio: number;
  faultRatio: number;
  referenceString: number[];
  frameCount: number;
}
