import type { DiskAlgorithm, DiskSimResult } from './types';

export const DEFAULT_DISK_REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];
export const DEFAULT_DISK_HEAD_START = 53;
export const DISK_MAX_TRACK = 199;

export function getDiskAlgoLabel(algorithm: DiskAlgorithm): string {
  const labels: Record<DiskAlgorithm, string> = {
    fcfs: 'FCFS', sstf: 'SSTF', scan: 'SCAN', cscan: 'C-SCAN', look: 'LOOK',
  };
  return labels[algorithm] ?? 'UNKNOWN';
}

export function getDiskAlgoInfo(algorithm: DiskAlgorithm): string {
  if (algorithm === 'fcfs')
    return 'FCFS (First Come First Served) services disk track requests strictly in the order they arrive, regardless of head position. It is fair and simple to implement, but may produce very high total head movement when requests are scattered across the disk.';
  if (algorithm === 'sstf')
    return 'SSTF (Shortest Seek Time First) always services the pending request closest to the current head position. This greedy strategy minimises seek time at each step but can cause starvation for requests far from the head when new closer requests continuously arrive.';
  if (algorithm === 'scan')
    return 'SCAN (Elevator Algorithm) moves the head toward higher-numbered tracks, servicing all requests along the way, then reverses direction and sweeps toward lower tracks. This bidirectional sweep prevents starvation and provides more uniform waiting times than SSTF.';
  if (algorithm === 'cscan')
    return 'C-SCAN (Circular SCAN) sweeps toward higher tracks servicing requests, then jumps back to track 0 without servicing any requests on the return, and sweeps upward again. This circular motion provides more uniform waiting times than standard SCAN.';
  if (algorithm === 'look')
    return 'LOOK is a refined variant of SCAN in which the head reverses direction at the last pending request rather than travelling all the way to the physical end of the disk. This reduces unnecessary head movement compared to SCAN, improving efficiency without sacrificing fairness.';
  return '';
}

export function computeDiskOrder(
  algorithm: DiskAlgorithm,
  requests: number[] = DEFAULT_DISK_REQUESTS,
  headStart: number = DEFAULT_DISK_HEAD_START
): number[] {
  const reqs = [...requests];

  if (algorithm === 'fcfs') return reqs;

  if (algorithm === 'sstf') {
    const remaining = [...reqs];
    const order: number[] = [];
    let current = headStart;
    while (remaining.length > 0) {
      remaining.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
      const next = remaining.shift()!;
      order.push(next);
      current = next;
    }
    return order;
  }

  const greater = reqs.filter(r => r >= headStart).sort((a, b) => a - b);
  const lesser = reqs.filter(r => r < headStart).sort((a, b) => a - b);

  if (algorithm === 'cscan') {
    // Sweep to disk end (199), jump to 0, then sweep up — boundary travel counts as movement
    const withBoundary = greater[greater.length - 1] === DISK_MAX_TRACK
      ? greater
      : [...greater, DISK_MAX_TRACK];
    return [...withBoundary, 0, ...lesser];
  }
  if (algorithm === 'scan') {
    // Travel to physical disk end before reversing (LOOK stops at last request instead)
    const withBoundary = greater[greater.length - 1] === DISK_MAX_TRACK
      ? greater
      : [...greater, DISK_MAX_TRACK];
    return [...withBoundary, ...lesser.slice().reverse()];
  }
  // LOOK: reverse at the last pending request, no boundary travel
  return [...greater, ...lesser.slice().reverse()];
}

export function computeDiskMovement(order: number[], headStart: number = DEFAULT_DISK_HEAD_START): number {
  let total = 0;
  let current = headStart;
  for (const track of order) {
    total += Math.abs(track - current);
    current = track;
  }
  return total;
}

export function computeDiskMovements(order: number[], headStart: number = DEFAULT_DISK_HEAD_START): number[] {
  const movements: number[] = [];
  let current = headStart;
  for (const track of order) {
    movements.push(Math.abs(track - current));
    current = track;
  }
  return movements;
}

export function runDiskSimulation(
  algorithm: DiskAlgorithm,
  requests: number[] = DEFAULT_DISK_REQUESTS,
  headStart: number = DEFAULT_DISK_HEAD_START
): DiskSimResult {
  const order = computeDiskOrder(algorithm, requests, headStart);
  const movements = computeDiskMovements(order, headStart);
  const totalMovement = movements.reduce((s, m) => s + m, 0);
  return { order, movements, totalMovement, headStart, requests };
}
