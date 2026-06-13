// app/api/cpu/scores/route.ts — CPU top scores API (isolated)

import { NextResponse } from 'next/server';
import { getTopCpuScores } from '@/services/cpu.service';

export async function GET() {
  try {
    const scores = await getTopCpuScores(10);
    return NextResponse.json({ scores });
  } catch (err) {
    console.error('[CPU Scores Error]', err);
    return NextResponse.json({ error: 'Failed to load CPU scores.' }, { status: 500 });
  }
}
