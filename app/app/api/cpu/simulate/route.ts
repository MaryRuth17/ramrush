// app/api/cpu/simulate/route.ts — CPU Scheduling simulation API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { computeCpuGantt, computeCpuStats, getCpuAlgoInfo, DEFAULT_CPU_PROCESSES, DEFAULT_CPU_QUANTUM } from '@/lib/cpu/algorithms';
import { generateCpuBreakdown } from '@/lib/cpu/breakdown';
import { saveCpuSession } from '@/services/cpu.service';
import type { CpuAlgorithm, CpuProcess } from '@/lib/cpu/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const algorithm: CpuAlgorithm = body.algorithm ?? 'fcfs';
    const processes: CpuProcess[] = body.processes ?? DEFAULT_CPU_PROCESSES;
    const quantum: number = body.quantum ?? DEFAULT_CPU_QUANTUM;

    const gantt = computeCpuGantt(algorithm, processes, quantum);
    const stats = computeCpuStats(gantt, processes);
    const breakdown = generateCpuBreakdown(algorithm, gantt, stats, processes, quantum);
    const algoInfo = getCpuAlgoInfo(algorithm, quantum);

    const session = await saveCpuSession({
      algorithm,
      mode: 'simulation',
      avgWaitingTime: parseFloat(stats.avgWaiting),
      avgTurnaround: parseFloat(stats.avgTurnaround),
      inputProcesses: processes,
      quantum,
    });

    return NextResponse.json({
      gantt,
      stats,
      breakdown,
      algoInfo,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('[CPU Simulate Error]', err);
    return NextResponse.json({ error: 'CPU simulation failed.' }, { status: 500 });
  }
}
