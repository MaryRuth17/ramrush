// services/disk.service.ts — Disk Scheduling DB service (isolated)
// Only imports from lib/prisma and lib/disk. Never touches Memory/CPU/VM tables.

import { prisma } from '@/lib/prisma';
import type { DiskAlgorithm } from '@/lib/disk/types';

export interface SaveDiskSessionInput {
  algorithm: DiskAlgorithm;
  mode: 'play' | 'simulation';
  headStart?: number;
  totalMovement: number;
  score?: number;
  hearts?: number;
  inputRequests?: number[] | null;
}

export async function saveDiskSession(input: SaveDiskSessionInput) {
  return prisma.diskSession.create({
    data: {
      algorithm: input.algorithm,
      mode: input.mode,
      headStart: input.headStart ?? 53,
      totalMovement: input.totalMovement,
      score: input.score ?? 0,
      hearts: input.hearts ?? 4,
      inputRequests: input.inputRequests ? JSON.stringify(input.inputRequests) : null,
    },
  });
}

export async function getTopDiskScores(limit = 10) {
  return prisma.diskSession.findMany({
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      algorithm: true,
      mode: true,
      score: true,
      headStart: true,
      totalMovement: true,
      createdAt: true,
    },
  });
}

export async function countDiskSessions() {
  return prisma.diskSession.count();
}
