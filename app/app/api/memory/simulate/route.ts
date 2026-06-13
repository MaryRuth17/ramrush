// app/api/memory/simulate/route.ts — Memory Allocation simulation API (isolated)

import { NextRequest, NextResponse } from 'next/server';
import { findTargetBlock, allocateToBlock, cloneBlocks, compactBlocks, getTotalFreeMemory, getAlgorithmLabel, getAlgorithmRule } from '@/lib/memory/algorithms';
import { generateMemoryBreakdown } from '@/lib/memory/breakdown';
import { saveMemorySession } from '@/services/memory.service';
import type { MemoryAlgorithm, MemoryBlock, MemoryProcess } from '@/lib/memory/types';

const DEFAULT_MEMORY: MemoryBlock[] = [
  { size: 120, used: false, processName: null, usedSize: 0 },
  { size: 200, used: false, processName: null, usedSize: 0 },
  { size: 300, used: false, processName: null, usedSize: 0 },
  { size: 150, used: false, processName: null, usedSize: 0 },
  { size: 250, used: false, processName: null, usedSize: 0 },
];

const DEFAULT_PROCESSES: MemoryProcess[] = [
  { id: 1, name: 'chrome.exe', size: 180 },
  { id: 2, name: 'discord.exe', size: 95 },
  { id: 3, name: 'spotify.exe', size: 80 },
  { id: 4, name: 'code.exe', size: 140 },
  { id: 5, name: 'photoshop.exe', size: 260 },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const algorithm: MemoryAlgorithm = body.algorithm ?? 'firstFit';
    const useCompaction: boolean = body.useCompaction ?? false;
    const processes: MemoryProcess[] = body.processes ?? DEFAULT_PROCESSES;
    const initialBlocks: MemoryBlock[] = body.blocks ?? cloneBlocks(DEFAULT_MEMORY);

    let blocks = cloneBlocks(initialBlocks);
    const history: Array<{ process: MemoryProcess; blockIndex: number; leftover: number }> = [];
    const processedList: MemoryProcess[] = [];
    const unprocessedList: Array<MemoryProcess & { reason: string }> = [];

    for (const process of processes) {
      let targetIdx = findTargetBlock(blocks, process, algorithm);

      if (targetIdx === -1 && useCompaction && getTotalFreeMemory(blocks) >= process.size) {
        blocks = compactBlocks(blocks);
        targetIdx = findTargetBlock(blocks, process, algorithm);
      }

      if (targetIdx === -1) {
        unprocessedList.push({ ...process, reason: `${getAlgorithmLabel(algorithm)} found no valid block` });
        continue;
      }

      const leftover = blocks[targetIdx].size - process.size;
      history.push({ process, blockIndex: targetIdx, leftover });
      blocks = allocateToBlock(blocks, process, targetIdx);
      processedList.push(process);
    }

    const breakdown = generateMemoryBreakdown(algorithm, blocks, history);
    const algoInfo = getAlgorithmRule(algorithm);

    const session = await saveMemorySession({
      algorithm,
      mode: 'simulation',
      processed: processedList.length,
      unprocessed: unprocessedList.length,
    });

    return NextResponse.json({
      finalBlocks: blocks,
      processed: processedList,
      unprocessed: unprocessedList,
      breakdown,
      algoInfo,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('[Memory Simulate Error]', err);
    return NextResponse.json({ error: 'Memory simulation failed.' }, { status: 500 });
  }
}
