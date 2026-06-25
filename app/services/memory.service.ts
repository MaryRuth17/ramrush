import { prisma } from '@/lib/prisma';
import type { MemoryAlgorithm, StageType } from '@/lib/memory/types';

export interface SaveMemorySessionInput {
  algorithm: MemoryAlgorithm;
  stageType?: StageType | null;
  mode: 'play' | 'simulation';
  score?: number;
  hearts?: number;
  processed?: number;
  unprocessed?: number;
}

export async function saveMemorySession(input: SaveMemorySessionInput) {
  return prisma.memorySession.create({
    data: {
      algorithm: input.algorithm,
      stageType: input.stageType ?? null,
      mode: input.mode,
      score: input.score ?? 0,
      hearts: input.hearts ?? 4,
      processed: input.processed ?? 0,
      unprocessed: input.unprocessed ?? 0,
    },
  });
}

export async function getTopMemoryScores(limit = 10) {
  return prisma.memorySession.findMany({
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      algorithm: true,
      mode: true,
      stageType: true,
      score: true,
      processed: true,
      unprocessed: true,
      createdAt: true,
    },
  });
}

export async function countMemorySessions() {
  return prisma.memorySession.count();
}
