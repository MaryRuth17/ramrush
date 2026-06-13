// services/vm.service.ts — Virtual Memory DB service (isolated)
// Only imports from lib/prisma and lib/vm. Never touches Memory/CPU/Disk tables.

import { prisma } from '@/lib/prisma';
import type { VmAlgorithm } from '@/lib/vm/types';

export interface SaveVmSessionInput {
  algorithm: VmAlgorithm;
  mode: 'play' | 'simulation';
  totalRefs: number;
  pageFaults: number;
  hits: number;
  hitRatio: number;
  score?: number;
  hearts?: number;
  inputRefString?: number[] | null;
  frameCount?: number;
}

export async function saveVmSession(input: SaveVmSessionInput) {
  return prisma.vmSession.create({
    data: {
      algorithm: input.algorithm,
      mode: input.mode,
      totalRefs: input.totalRefs,
      pageFaults: input.pageFaults,
      hits: input.hits,
      hitRatio: input.hitRatio,
      score: input.score ?? 0,
      hearts: input.hearts ?? 4,
      inputRefString: input.inputRefString ? JSON.stringify(input.inputRefString) : null,
      frameCount: input.frameCount ?? 3,
    },
  });
}

export async function getTopVmScores(limit = 10) {
  return prisma.vmSession.findMany({
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      algorithm: true,
      mode: true,
      score: true,
      pageFaults: true,
      hitRatio: true,
      frameCount: true,
      createdAt: true,
    },
  });
}

export async function countVmSessions() {
  return prisma.vmSession.count();
}
