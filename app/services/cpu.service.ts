import { prisma } from '@/lib/prisma';
import type { CpuAlgorithm, CpuProcess } from '@/lib/cpu/types';

export interface SaveCpuSessionInput {
  algorithm: CpuAlgorithm;
  mode: 'play' | 'simulation';
  avgWaitingTime?: number | null;
  avgTurnaround?: number | null;
  score?: number;
  hearts?: number;
  inputProcesses?: CpuProcess[] | null;
  quantum?: number;
}

export async function saveCpuSession(input: SaveCpuSessionInput) {
  return prisma.cpuSession.create({
    data: {
      algorithm: input.algorithm,
      mode: input.mode,
      avgWaitingTime: input.avgWaitingTime ?? null,
      avgTurnaround: input.avgTurnaround ?? null,
      score: input.score ?? 0,
      hearts: input.hearts ?? 4,
      inputProcesses: input.inputProcesses ? JSON.stringify(input.inputProcesses) : null,
      quantum: input.quantum ?? 2,
    },
  });
}

export async function getTopCpuScores(limit = 10) {
  return prisma.cpuSession.findMany({
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      algorithm: true,
      mode: true,
      score: true,
      avgWaitingTime: true,
      avgTurnaround: true,
      createdAt: true,
    },
  });
}

export async function countCpuSessions() {
  return prisma.cpuSession.count();
}
