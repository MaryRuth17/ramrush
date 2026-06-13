// app/api/memory/scores/route.ts — Memory top scores API (isolated)

import { NextResponse } from 'next/server';
import { getTopMemoryScores } from '@/services/memory.service';

export async function GET() {
  try {
    const scores = await getTopMemoryScores(10);
    return NextResponse.json({ scores });
  } catch (err) {
    console.error('[Memory Scores Error]', err);
    return NextResponse.json({ error: 'Failed to load memory scores.' }, { status: 500 });
  }
}
