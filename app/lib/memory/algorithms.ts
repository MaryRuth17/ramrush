import type { MemoryBlock, MemoryProcess, MemoryAlgorithm } from './types';

export function cloneBlocks(blocks: MemoryBlock[]): MemoryBlock[] {
  return JSON.parse(JSON.stringify(blocks));
}

export function findFirstFit(blocks: MemoryBlock[], process: MemoryProcess): number {
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].used && blocks[i].size >= process.size) return i;
  }
  return -1;
}

export function findBestFit(blocks: MemoryBlock[], process: MemoryProcess): number {
  let bestIndex = -1;
  let smallestLeftover = Infinity;
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].used && blocks[i].size >= process.size) {
      const leftover = blocks[i].size - process.size;
      if (leftover < smallestLeftover) {
        smallestLeftover = leftover;
        bestIndex = i;
      }
    }
  }
  return bestIndex;
}

export function findWorstFit(blocks: MemoryBlock[], process: MemoryProcess): number {
  let worstIndex = -1;
  let largestBlock = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].used && blocks[i].size >= process.size) {
      if (blocks[i].size > largestBlock) {
        largestBlock = blocks[i].size;
        worstIndex = i;
      }
    }
  }
  return worstIndex;
}

export function findTargetBlock(
  blocks: MemoryBlock[],
  process: MemoryProcess,
  algorithm: MemoryAlgorithm
): number {
  if (algorithm === 'firstFit') return findFirstFit(blocks, process);
  if (algorithm === 'bestFit') return findBestFit(blocks, process);
  if (algorithm === 'worstFit') return findWorstFit(blocks, process);
  return -1;
}

export function allocateToBlock(
  blocks: MemoryBlock[],
  process: MemoryProcess,
  blockIndex: number
): MemoryBlock[] {
  const next = cloneBlocks(blocks);
  const block = next[blockIndex];
  const leftover = block.size - process.size;

  block.used = true;
  block.processName = process.name;
  block.usedSize = process.size;
  block.size = process.size;

  if (leftover > 0) {
    next.splice(blockIndex + 1, 0, {
      size: leftover,
      used: false,
      processName: null,
      usedSize: 0,
    });
  }
  return next;
}

export function compactBlocks(blocks: MemoryBlock[]): MemoryBlock[] {
  const used = blocks.filter(b => b.used);
  const totalFree = blocks.filter(b => !b.used).reduce((s, b) => s + b.size, 0);
  if (totalFree > 0) {
    used.push({ size: totalFree, used: false, processName: null, usedSize: 0 });
  }
  return used;
}

export function getTotalFreeMemory(blocks: MemoryBlock[]): number {
  return blocks.filter(b => !b.used).reduce((s, b) => s + b.size, 0);
}

export function getAlgorithmLabel(algorithm: MemoryAlgorithm): string {
  const labels: Record<MemoryAlgorithm, string> = {
    firstFit: 'FIRST FIT',
    bestFit: 'BEST FIT',
    worstFit: 'WORST FIT',
  };
  return labels[algorithm] ?? 'UNKNOWN';
}

export function getAlgorithmRule(algorithm: MemoryAlgorithm): string {
  if (algorithm === 'firstFit') return 'Click the FIRST free block that is large enough.';
  if (algorithm === 'bestFit') return 'Click the SMALLEST free block that is still large enough.';
  if (algorithm === 'worstFit') return 'Click the LARGEST free block available.';
  return '';
}
