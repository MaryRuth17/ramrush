// app/api/disk/scores/route.ts — Disk top scores API (isolated)

import { NextResponse } from 'next/server';
import { getTopDiskScores } from '@/services/disk.service';

export async function GET() {
  try {
    const scores = await getTopDiskScores(10);
    return NextResponse.json({ scores });
  } catch (err) {
    console.error('[Disk Scores Error]', err);
    return NextResponse.json({ error: 'Failed to load Disk scores.' }, { status: 500 });
  }
}
