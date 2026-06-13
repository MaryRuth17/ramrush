// app/api/vm/simulate/route.ts — Virtual Memory simulation API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { runVmSimulation, getVmAlgoInfo, DEFAULT_VM_REFERENCE_STRING, DEFAULT_VM_FRAME_COUNT } from '@/lib/vm/algorithms';
import { generateVmBreakdown } from '@/lib/vm/breakdown';
import { saveVmSession } from '@/services/vm.service';
import type { VmAlgorithm } from '@/lib/vm/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const algorithm: VmAlgorithm = body.algorithm ?? 'fifo';
    const referenceString: number[] = body.referenceString ?? DEFAULT_VM_REFERENCE_STRING;
    const frameCount: number = body.frameCount ?? DEFAULT_VM_FRAME_COUNT;

    const result = runVmSimulation(algorithm, referenceString, frameCount);
    const breakdown = generateVmBreakdown(algorithm, result);
    const algoInfo = getVmAlgoInfo(algorithm);

    const session = await saveVmSession({
      algorithm,
      mode: 'simulation',
      totalRefs: referenceString.length,
      pageFaults: result.faults,
      hits: result.hits,
      hitRatio: result.hitRatio,
      inputRefString: referenceString,
      frameCount,
    });

    return NextResponse.json({
      result,
      breakdown,
      algoInfo,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('[VM Simulate Error]', err);
    return NextResponse.json({ error: 'VM simulation failed.' }, { status: 500 });
  }
}
