import type { MemoryBlock, MemoryProcess, MemoryAlgorithm } from './types';
import { getAlgorithmLabel } from './algorithms';

export interface BreakdownStep {
  step: number;
  title: string;
  explanation: string;
  formula?: string;
}

export function generateMemoryBreakdown(
  algorithm: MemoryAlgorithm,
  blocks: MemoryBlock[],
  processHistory: Array<{ process: MemoryProcess; blockIndex: number; leftover: number }>
): BreakdownStep[] {
  const steps: BreakdownStep[] = [];

  steps.push({
    step: 1,
    title: 'Algorithm Selection',
    explanation: `The ${getAlgorithmLabel(algorithm)} algorithm was selected. ${getAlgorithmDescription(algorithm)}`,
  });

  steps.push({
    step: 2,
    title: 'Initial Memory Layout',
    explanation: `Starting memory contains ${blocks.length} block(s) with a total free capacity of ${blocks.filter(b => !b.used).reduce((s, b) => s + b.size, 0)} MB.`,
  });

  processHistory.forEach((entry, idx) => {
    const { process, blockIndex, leftover } = entry;
    steps.push({
      step: idx + 3,
      title: `Allocate ${process.name} (${process.size} MB)`,
      explanation: `${getAlgorithmLabel(algorithm)} selects Block ${blockIndex + 1}. Process requires ${process.size} MB. ${leftover > 0 ? `Block is split: ${process.size} MB used + ${leftover} MB leftover free fragment.` : 'Block exactly fits with no fragmentation.'}`,
      formula: leftover > 0
        ? `Block Size (${process.size + leftover} MB) − Process Size (${process.size} MB) = Leftover Fragment (${leftover} MB)`
        : `Block Size = Process Size = ${process.size} MB (perfect fit, no fragmentation)`,
    });
  });

  const processed = processHistory.length;
  const freeAfter = blocks.filter(b => !b.used).reduce((s, b) => s + b.size, 0);
  steps.push({
    step: processHistory.length + 3,
    title: 'Final Memory State',
    explanation: `${processed} process(es) allocated successfully. Remaining free memory: ${freeAfter} MB across ${blocks.filter(b => !b.used).length} free block(s). Internal fragmentation occurs whenever a process is smaller than its allocated block.`,
  });

  return steps;
}

function getAlgorithmDescription(algorithm: MemoryAlgorithm): string {
  if (algorithm === 'firstFit')
    return 'First Fit scans memory from the start and assigns the process to the very first free block that is large enough, minimizing search time but potentially leaving small unusable fragments at the front of memory.';
  if (algorithm === 'bestFit')
    return 'Best Fit examines all free blocks and selects the one with the smallest leftover space after allocation, aiming to minimise internal fragmentation at the cost of higher search overhead.';
  if (algorithm === 'worstFit')
    return 'Worst Fit assigns the process to the largest available free block, leaving behind the biggest possible leftover fragment, which may be large enough to satisfy future allocation requests.';
  return '';
}
