// app/api/memory/play/route.ts — Memory play session save (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { saveMemorySession } from '@/services/memory.service';
import type { MemoryAlgorithm, StageType } from '@/lib/memory/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await saveMemorySession({
      algorithm: body.algorithm as MemoryAlgorithm,
      stageType: body.stageType as StageType,
      mode: 'play',
      score: body.score ?? 0,
      hearts: body.hearts ?? 0,
      processed: body.processed ?? 0,
      unprocessed: body.unprocessed ?? 0,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[Memory Play Save Error]', err);
    return NextResponse.json({ error: 'Failed to save memory play session.' }, { status: 500 });
  }
}
