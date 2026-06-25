import type { DiskAlgorithm, DiskSimResult } from './types';
import { getDiskAlgoLabel } from './algorithms';

export interface BreakdownStep {
  step: number;
  title: string;
  explanation: string;
  formula?: string;
}

export function generateDiskBreakdown(
  algorithm: DiskAlgorithm,
  result: DiskSimResult
): BreakdownStep[] {
  const steps: BreakdownStep[] = [];
  const { order, movements, totalMovement, headStart, requests } = result;

  steps.push({
    step: 1,
    title: 'Algorithm Overview',
    explanation: `The ${getDiskAlgoLabel(algorithm)} disk scheduling algorithm was applied to ${requests.length} pending I/O request(s). ${getAlgorithmDescription(algorithm)} The disk head begins at track ${headStart}.`,
  });

  steps.push({
    step: 2,
    title: 'Input Requests',
    explanation:
      'The following disk track numbers are waiting to be serviced. Each represents the physical cylinder (track) that a pending read or write operation needs to access. The order in which the disk head visits these tracks determines the total seek time.',
    formula: `Requests: [${requests.join(', ')}]  |  Head Start: ${headStart}`,
  });

  steps.push({
    step: 3,
    title: 'Service Order',
    explanation: `Under ${getDiskAlgoLabel(algorithm)}, the requests are serviced in the following sequence. ${getOrderRationale(algorithm, headStart)}`,
    formula: `${headStart} → ${order.join(' → ')}`,
  });

  order.forEach((track, i) => {
    const prev = i === 0 ? headStart : order[i - 1];
    steps.push({
      step: i + 4,
      title: `Move ${i + 1}: Head from Track ${prev} to Track ${track}`,
      explanation: `The disk head seeks from track ${prev} to track ${track}, traversing ${movements[i]} track position(s). Seek distance is always calculated as the absolute difference between the current and destination track numbers.`,
      formula: `|${track} − ${prev}| = ${movements[i]} track(s)`,
    });
  });

  steps.push({
    step: steps.length + 1,
    title: 'Total Head Movement Calculation',
    explanation:
      'Total head movement is the sum of all individual seek distances across the entire service sequence. It serves as the primary performance metric for disk scheduling algorithms — a lower total movement corresponds to reduced average seek time and higher disk throughput.',
    formula: `Total = ${movements.join(' + ')} = ${totalMovement} track(s)`,
  });

  return steps;
}

function getAlgorithmDescription(algorithm: DiskAlgorithm): string {
  if (algorithm === 'fcfs')
    return 'FCFS services requests in their exact arrival order without reordering based on proximity.';
  if (algorithm === 'sstf')
    return 'SSTF repeatedly selects the request nearest to the current head position, reordering the service queue greedily at each step.';
  if (algorithm === 'scan')
    return 'SCAN sweeps toward higher track numbers, services all requests in that direction, then reverses to sweep toward lower track numbers.';
  if (algorithm === 'cscan')
    return 'C-SCAN sweeps toward higher tracks, then jumps back to track 0 and continues sweeping upward in a circular fashion.';
  if (algorithm === 'look')
    return 'LOOK sweeps toward higher tracks up to the last pending request, then reverses without going to the physical disk boundary.';
  return '';
}

function getOrderRationale(algorithm: DiskAlgorithm, headStart: number): string {
  if (algorithm === 'fcfs')
    return 'Requests are served exactly in the order they arrived, with no optimisation for head proximity.';
  if (algorithm === 'sstf')
    return 'At each step, the closest unserviced request to the current head position is selected next, minimising individual seek distances.';
  if (algorithm === 'scan')
    return `The head sweeps upward from ${headStart} servicing all higher-numbered requests, then reverses to service lower-numbered requests in descending order.`;
  if (algorithm === 'cscan')
    return `The head sweeps upward from ${headStart} servicing higher-numbered requests, then jumps back to service lower-numbered requests in ascending order.`;
  if (algorithm === 'look')
    return `The head sweeps upward from ${headStart} to the highest pending request, then reverses to service lower-numbered requests without going past the last request.`;
  return '';
}
