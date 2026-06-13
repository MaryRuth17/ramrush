// lib/vm/breakdown.ts — Step-by-step math breakdown for Virtual Memory

import type { VmAlgorithm, VmSimResult } from './types';
import { getVmAlgoLabel } from './algorithms';

export interface BreakdownStep {
  step: number;
  title: string;
  explanation: string;
  formula?: string;
}

export function generateVmBreakdown(
  algorithm: VmAlgorithm,
  result: VmSimResult
): BreakdownStep[] {
  const steps: BreakdownStep[] = [];
  const { referenceString, frameCount, faults, hits, hitRatio, faultRatio, steps: simSteps } = result;
  const total = referenceString.length;

  steps.push({
    step: 1,
    title: 'Algorithm Overview',
    explanation: `The ${getVmAlgoLabel(algorithm)} page replacement algorithm was applied to a reference string of ${total} page references using ${frameCount} available memory frame(s). ${getAlgorithmDescription(algorithm)}`,
  });

  steps.push({
    step: 2,
    title: 'Reference String Input',
    explanation:
      'The reference string defines the sequence in which pages are requested by a running process. Each number represents a virtual page number. When a requested page is not currently loaded in any frame, a page fault occurs.',
    formula: `Reference String: [${referenceString.join(', ')}]  |  Frame Count: ${frameCount}`,
  });

  // Show first few steps concisely
  const showSteps = simSteps.slice(0, Math.min(8, simSteps.length));
  showSteps.forEach((s, i) => {
    steps.push({
      step: i + 3,
      title: `Reference ${i + 1}: Page ${referenceString[i]} — ${s.log.toUpperCase()}`,
      explanation: s.message,
      formula: `Frames after step: [${s.frameSlots.map(f => (f === null ? 'EMPTY' : `P${f}`)).join(', ')}]`,
    });
  });

  if (total > 8) {
    steps.push({
      step: showSteps.length + 3,
      title: `References 9–${total}`,
      explanation: `The remaining ${total - 8} references follow the same ${getVmAlgoLabel(algorithm)} replacement logic. Each fault increments the fault counter; each hit leaves the frames unchanged.`,
    });
  }

  steps.push({
    step: steps.length + 1,
    title: 'Page Fault Count',
    explanation:
      'A page fault occurs every time a requested page is absent from all frames and must be loaded from secondary storage. Faults are expensive operations because they require disk I/O, making fault minimisation a central goal of page replacement algorithm design.',
    formula: `Total Faults = ${faults} out of ${total} references`,
  });

  steps.push({
    step: steps.length + 1,
    title: 'Hit Ratio Calculation',
    explanation:
      'The Hit Ratio measures the proportion of memory accesses that were satisfied directly from the existing frames without triggering a page fault. A higher hit ratio indicates better cache utilisation and improved overall system performance.',
    formula: `Hit Ratio = Hits ÷ Total References = ${hits} ÷ ${total} = ${(hitRatio * 100).toFixed(1)}%`,
  });

  steps.push({
    step: steps.length + 1,
    title: 'Fault Ratio Calculation',
    explanation:
      'The Fault Ratio (also called the Miss Rate) is the complement of the Hit Ratio. It quantifies the fraction of accesses that resulted in a page fault, directly impacting system throughput and response time.',
    formula: `Fault Ratio = Faults ÷ Total References = ${faults} ÷ ${total} = ${(faultRatio * 100).toFixed(1)}%  |  Alternatively: 1 − Hit Ratio = 1 − ${(hitRatio * 100).toFixed(1)}% = ${(faultRatio * 100).toFixed(1)}%`,
  });

  return steps;
}

function getAlgorithmDescription(algorithm: VmAlgorithm): string {
  if (algorithm === 'fifo')
    return 'FIFO maintains a queue of pages ordered by their load time. The page at the head of the queue — the one that has been resident in memory for the longest duration — is selected as the victim when a replacement is required. Despite its simplicity, FIFO can suffer from Bélády\'s anomaly, where adding more frames paradoxically increases the number of page faults.';
  if (algorithm === 'lru')
    return 'LRU exploits the principle of temporal locality: pages used recently are likely to be used again soon. By evicting the least recently accessed page, LRU achieves close-to-optimal performance without needing future knowledge. Its main implementation challenge is the overhead of tracking precise access timestamps.';
  if (algorithm === 'optimal')
    return 'The Optimal algorithm provides a theoretical lower bound on page faults. It always replaces the page whose next use is furthest in the future, guaranteeing the minimum possible fault rate for any given reference string and frame count. Because it requires future knowledge, it serves as a benchmark rather than a practical algorithm.';
  return '';
}
