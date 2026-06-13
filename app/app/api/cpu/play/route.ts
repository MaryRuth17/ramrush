// app/api/cpu/play/route.ts — CPU Scheduling play session save API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { saveCpuSession } from '@/services/cpu.service';
import type { CpuAlgorithm } from '@/lib/cpu/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await saveCpuSession({
      algorithm: body.algorithm as CpuAlgorithm,
      mode: 'play',
      score: body.score ?? 0,
      hearts: body.hearts ?? 0,
      quantum: body.quantum ?? 2,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[CPU Play Save Error]', err);
    return NextResponse.json({ error: 'Failed to save CPU play session.' }, { status: 500 });
  }
}
