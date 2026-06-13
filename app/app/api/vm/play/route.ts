// app/api/vm/play/route.ts — Virtual Memory play session save API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { saveVmSession } from '@/services/vm.service';
import type { VmAlgorithm } from '@/lib/vm/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await saveVmSession({
      algorithm: body.algorithm as VmAlgorithm,
      mode: 'play',
      totalRefs: body.totalRefs ?? 0,
      pageFaults: body.pageFaults ?? 0,
      hits: body.hits ?? 0,
      hitRatio: body.hitRatio ?? 0,
      score: body.score ?? 0,
      hearts: body.hearts ?? 0,
      frameCount: body.frameCount ?? 3,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[VM Play Save Error]', err);
    return NextResponse.json({ error: 'Failed to save VM play session.' }, { status: 500 });
  }
}
