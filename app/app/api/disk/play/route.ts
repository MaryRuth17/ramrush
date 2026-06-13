// app/api/disk/play/route.ts — Disk Scheduling play session save API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { saveDiskSession } from '@/services/disk.service';
import type { DiskAlgorithm } from '@/lib/disk/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await saveDiskSession({
      algorithm: body.algorithm as DiskAlgorithm,
      mode: 'play',
      headStart: body.headStart ?? 53,
      totalMovement: body.totalMovement ?? 0,
      score: body.score ?? 0,
      hearts: body.hearts ?? 0,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[Disk Play Save Error]', err);
    return NextResponse.json({ error: 'Failed to save Disk play session.' }, { status: 500 });
  }
}
