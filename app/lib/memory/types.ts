export type MemoryAlgorithm = 'firstFit' | 'bestFit' | 'worstFit';
export type StageType = 'easy' | 'normal' | 'hard';

export interface MemoryBlock {
  size: number;
  used: boolean;
  processName: string | null;
  usedSize: number;
}

export interface MemoryProcess {
  id: number;
  name: string;
  size: number;
}

export interface AllocationResult {
  targetIndex: number;
  leftover: number;
  blocksBefore: MemoryBlock[];
  blocksAfter: MemoryBlock[];
}

export interface MemoryRunStats {
  algorithm: MemoryAlgorithm;
  stageType: StageType | null;
  processed: MemoryProcess[];
  unprocessed: Array<MemoryProcess & { reason: string }>;
  score: number;
  heartsLeft: number;
}
