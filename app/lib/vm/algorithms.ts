// lib/vm/algorithms.ts — Virtual Memory isolated algorithm logic

import type { VmAlgorithm, VmStepState, VmSimResult } from './types';

export const DEFAULT_VM_REFERENCE_STRING = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
export const DEFAULT_VM_FRAME_COUNT = 3;

export function getVmAlgoLabel(algorithm: VmAlgorithm): string {
  const labels: Record<VmAlgorithm, string> = { fifo: 'FIFO', lru: 'LRU', optimal: 'OPTIMAL' };
  return labels[algorithm] ?? 'UNKNOWN';
}

export function getVmAlgoInfo(algorithm: VmAlgorithm): string {
  if (algorithm === 'fifo')
    return 'FIFO (First-In First-Out): when a page fault occurs and all frames are occupied, the page that has been in memory the longest is replaced first. This mimics a simple queue where the oldest resident page is always the victim.';
  if (algorithm === 'lru')
    return 'LRU (Least Recently Used): replaces the page that was accessed least recently among all frames. By keeping recently used pages in memory, LRU approximates the optimal algorithm using past access history.';
  if (algorithm === 'optimal')
    return 'Optimal (Bélády\'s Algorithm): replaces the page that will not be used again for the longest period in the future. This algorithm is theoretically ideal but unrealisable in practice because it requires complete knowledge of future references.';
  return '';
}

export function runVmSimulation(
  algorithm: VmAlgorithm,
  referenceString: number[] = DEFAULT_VM_REFERENCE_STRING,
  frameCount: number = DEFAULT_VM_FRAME_COUNT
): VmSimResult {
  let frames: (number | null)[] = new Array(frameCount).fill(null);
  let fifoOrder: number[] = [];
  let recency: number[] = new Array(frameCount).fill(-1);
  let faults = 0;
  let hits = 0;
  const steps: VmStepState[] = [];

  referenceString.forEach((page, index) => {
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // HIT
      hits++;
      recency[frameIndex] = index;
      steps.push({
        frameSlots: [...frames],
        log: 'hit',
        message: `Page ${page} already in Frame ${frameIndex + 1}. HIT — no replacement needed.`,
        loadedPage: page,
      });
    } else {
      // FAULT
      faults++;
      const emptySlot = frames.indexOf(null);

      if (emptySlot !== -1) {
        frames = [...frames];
        frames[emptySlot] = page;
        fifoOrder.push(emptySlot);
        recency[emptySlot] = index;
        steps.push({
          frameSlots: [...frames],
          log: 'fault',
          message: `Page ${page} loaded into empty Frame ${emptySlot + 1}. FAULT — no victim needed.`,
          loadedPage: page,
        });
      } else {
        const victim = findVictim(algorithm, frames as number[], fifoOrder, recency, referenceString, index);
        const oldPage = frames[victim];
        frames = [...frames];
        frames[victim] = page;
        recency[victim] = index;

        if (algorithm === 'fifo') {
          fifoOrder = fifoOrder.filter(f => f !== victim);
          fifoOrder.push(victim);
        }

        steps.push({
          frameSlots: [...frames],
          log: 'fault',
          message: `Page ${page} replaces page ${oldPage} in Frame ${victim + 1} via ${getVmAlgoLabel(algorithm)}. FAULT.`,
          victimFrame: victim,
          loadedPage: page,
        });
      }
    }
  });

  const total = referenceString.length;
  return {
    steps,
    faults,
    hits,
    hitRatio: hits / total,
    faultRatio: faults / total,
    referenceString,
    frameCount,
  };
}

export function findVictim(
  algorithm: VmAlgorithm,
  frames: number[],
  fifoOrder: number[],
  recency: number[],
  referenceString: number[],
  currentIndex: number
): number {
  if (algorithm === 'fifo') return fifoOrder[0];

  if (algorithm === 'lru') {
    return recency.indexOf(Math.min(...recency));
  }

  if (algorithm === 'optimal') {
    let victim = 0;
    let farthest = -1;
    for (let i = 0; i < frames.length; i++) {
      let next = referenceString.indexOf(frames[i], currentIndex + 1);
      if (next === -1) next = Infinity;
      if (next > farthest) { farthest = next; victim = i; }
    }
    return victim;
  }

  return 0;
}
