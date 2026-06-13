// app/api/disk/simulate/route.ts — Disk Scheduling simulation API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { runDiskSimulation, getDiskAlgoInfo, DEFAULT_DISK_REQUESTS, DEFAULT_DISK_HEAD_START } from '@/lib/disk/algorithms';
import { generateDiskBreakdown } from '@/lib/disk/breakdown';
import { saveDiskSession } from '@/services/disk.service';
import type { DiskAlgorithm } from '@/lib/disk/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const algorithm: DiskAlgorithm = body.algorithm ?? 'fcfs';
    const requests: number[] = body.requests ?? DEFAULT_DISK_REQUESTS;
    const headStart: number = body.headStart ?? DEFAULT_DISK_HEAD_START;

    const result = runDiskSimulation(algorithm, requests, headStart);
    const breakdown = generateDiskBreakdown(algorithm, result);
    const algoInfo = getDiskAlgoInfo(algorithm);

    const session = await saveDiskSession({
      algorithm,
      mode: 'simulation',
      headStart,
      totalMovement: result.totalMovement,
      inputRequests: requests,
    });

    return NextResponse.json({
      result,
      breakdown,
      algoInfo,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('[Disk Simulate Error]', err);
    return NextResponse.json({ error: 'Disk simulation failed.' }, { status: 500 });
  }
}
