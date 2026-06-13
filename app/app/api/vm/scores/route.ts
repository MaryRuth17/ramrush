// app/api/vm/scores/route.ts — VM top scores API (isolated)

import { NextResponse } from 'next/server';
import { getTopVmScores } from '@/services/vm.service';

export async function GET() {
  try {
    const scores = await getTopVmScores(10);
    return NextResponse.json({ scores });
  } catch (err) {
    console.error('[VM Scores Error]', err);
    return NextResponse.json({ error: 'Failed to load VM scores.' }, { status: 500 });
  }
}
