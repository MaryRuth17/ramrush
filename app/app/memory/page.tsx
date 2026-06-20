'use client';

// app/memory/page.tsx — Memory Allocation topic page (Play + Simulation + Custom Input)

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TimerBar } from '@/components/ui/TimerBar';
import { HeartDisplay } from '@/components/ui/HeartDisplay';
import { MathBreakdownPanel } from '@/components/ui/MathBreakdownPanel';
import { JustifiedText } from '@/components/ui/JustifiedText';
import {
  findTargetBlock,
  allocateToBlock,
  cloneBlocks,
  compactBlocks,
  getTotalFreeMemory,
  getAlgorithmLabel,
  getAlgorithmRule,
} from '@/lib/memory/algorithms';
import { generateMemoryBreakdown } from '@/lib/memory/breakdown';
import type { MemoryAlgorithm, MemoryBlock, MemoryProcess } from '@/lib/memory/types';
import type { BreakdownStep } from '@/lib/memory/breakdown';
import { MAX_HEARTS, TIMER_BY_DIFFICULTY } from '@/lib/game/constants';
import { DifficultySelect } from '@/components/ui/DifficultySelect';
import { GameHeader } from '@/components/ui/GameHeader';

type Screen = 'modeSelect' | 'stageSelect' | 'algoSelect' | 'play' | 'simulation';

const DEFAULT_MEMORY: MemoryBlock[] = [
  { size: 120, used: false, processName: null, usedSize: 0 },
  { size: 200, used: false, processName: null, usedSize: 0 },
  { size: 300, used: false, processName: null, usedSize: 0 },
  { size: 150, used: false, processName: null, usedSize: 0 },
  { size: 250, used: false, processName: null, usedSize: 0 },
];

type StageEntry = { blocks: MemoryBlock[]; processes: MemoryProcess[] };
const mb = (size: number): MemoryBlock => ({ size, used: false, processName: null, usedSize: 0 });

const STAGE_DATA: Record<'easy' | 'normal' | 'hard', StageEntry[]> = {
  easy: [
    // Set A — clear size spread, algo differences subtle
    {
      blocks: [mb(200), mb(150), mb(300)],
      processes: [{ id: 1, name: 'notepad.exe', size: 80 }, { id: 2, name: 'calc.exe', size: 140 }, { id: 3, name: 'paint.exe', size: 120 }],
    },
    // Set B — 200-size process: FF→250, BF→200 (exact fit!)
    {
      blocks: [mb(100), mb(250), mb(200)],
      processes: [{ id: 1, name: 'notepad.exe', size: 90 }, { id: 2, name: 'calc.exe', size: 200 }, { id: 3, name: 'paint.exe', size: 100 }],
    },
    // Set C — 70-size process: FF→180 (wastes 110), BF→80 (only 10 left)
    {
      blocks: [mb(180), mb(80), mb(250)],
      processes: [{ id: 1, name: 'notepad.exe', size: 70 }, { id: 2, name: 'calc.exe', size: 220 }, { id: 3, name: 'paint.exe', size: 75 }],
    },
  ],
  normal: [
    // Set A — default; photoshop (260) can only fit in 300-block
    {
      blocks: DEFAULT_MEMORY,
      processes: [{ id: 1, name: 'chrome.exe', size: 180 }, { id: 2, name: 'discord.exe', size: 95 }, { id: 3, name: 'spotify.exe', size: 80 }, { id: 4, name: 'code.exe', size: 140 }, { id: 5, name: 'photoshop.exe', size: 260 }],
    },
    // Set B — 85-size: FF→350 (wastes 265), BF→80 (tight fit); game.exe (310) needs 350 or 300
    {
      blocks: [mb(350), mb(100), mb(250), mb(80), mb(300)],
      processes: [{ id: 1, name: 'game.exe', size: 85 }, { id: 2, name: 'browser.exe', size: 230 }, { id: 3, name: 'editor.exe', size: 90 }, { id: 4, name: 'studio.exe', size: 280 }, { id: 5, name: 'server.exe', size: 310 }],
    },
    // Set C — web.exe (190) exact-fits 200 under BF; db.exe (380) can only fit 400
    {
      blocks: [mb(200), mb(350), mb(100), mb(400), mb(150)],
      processes: [{ id: 1, name: 'web.exe', size: 190 }, { id: 2, name: 'render.exe', size: 310 }, { id: 3, name: 'cache.exe', size: 95 }, { id: 4, name: 'db.exe', size: 380 }, { id: 5, name: 'proxy.exe', size: 140 }],
    },
  ],
  hard: [
    // Set A — tight fits throughout; discord (55) competes with zoom (90) for small blocks
    {
      blocks: [mb(80), mb(60), mb(200), mb(120), mb(170), mb(50)],
      processes: [{ id: 1, name: 'chrome.exe', size: 75 }, { id: 2, name: 'vscode.exe', size: 110 }, { id: 3, name: 'steam.exe', size: 180 }, { id: 4, name: 'discord.exe', size: 55 }, { id: 5, name: 'obs.exe', size: 160 }, { id: 6, name: 'zoom.exe', size: 90 }],
    },
    // Set B — 140 competes for 150; BF vs WF send it to very different blocks
    {
      blocks: [mb(150), mb(50), mb(300), mb(90), mb(200), mb(70)],
      processes: [{ id: 1, name: 'agent.exe', size: 140 }, { id: 2, name: 'log.exe', size: 45 }, { id: 3, name: 'engine.exe', size: 280 }, { id: 4, name: 'sync.exe', size: 80 }, { id: 5, name: 'api.exe', size: 190 }, { id: 6, name: 'cli.exe', size: 60 }],
    },
    // Set C — kernel (300) can only fit 320; FF vs BF split on who gets 180 vs 250
    {
      blocks: [mb(100), mb(250), mb(60), mb(180), mb(320), mb(80)],
      processes: [{ id: 1, name: 'kernel.exe', size: 300 }, { id: 2, name: 'daemon.exe', size: 90 }, { id: 3, name: 'driver.exe', size: 55 }, { id: 4, name: 'module.exe', size: 160 }, { id: 5, name: 'plugin.exe', size: 220 }, { id: 6, name: 'hook.exe', size: 70 }],
    },
  ],
};

export default function MemoryPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [mode, setMode] = useState<'play' | 'simulation'>('simulation');
  const [stage, setStage] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [algorithm, setAlgorithm] = useState<MemoryAlgorithm>('firstFit');

  // Custom input state
  const [customBlocks, setCustomBlocks] = useState<MemoryBlock[]>(cloneBlocks(DEFAULT_MEMORY));
  const [customProcesses, setCustomProcesses] = useState<MemoryProcess[]>([
    { id: 1, name: 'chrome.exe', size: 180 },
    { id: 2, name: 'discord.exe', size: 95 },
    { id: 3, name: 'spotify.exe', size: 80 },
    { id: 4, name: 'code.exe', size: 140 },
    { id: 5, name: 'photoshop.exe', size: 260 },
  ]);
  const [useCustom, setUseCustom] = useState(false);
  const [useCompaction, setUseCompaction] = useState(false);

  // Simulation state
  const [simBlocks, setSimBlocks] = useState<MemoryBlock[]>([]);
  const [simProcesses, setSimProcesses] = useState<MemoryProcess[]>([]);
  const [simStep, setSimStep] = useState(0);
  const [simHistory, setSimHistory] = useState<Array<{ process: MemoryProcess; blockIndex: number; leftover: number }>>([]);
  const [simMessage, setSimMessage] = useState('Press STEP to allocate the next process.');
  const [breakdown, setBreakdown] = useState<BreakdownStep[]>([]);
  const [processed, setProcessed] = useState<MemoryProcess[]>([]);
  const [unprocessed, setUnprocessed] = useState<Array<MemoryProcess & { reason: string }>>([]);

  // Play state
  const [playBlocks, setPlayBlocks] = useState<MemoryBlock[]>([]);
  const [playProcesses, setPlayProcesses] = useState<MemoryProcess[]>([]);
  const [playQueue, setPlayQueue] = useState<MemoryProcess[]>([]);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [score, setScore] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playMessage, setPlayMessage] = useState('');
  const [playDone, setPlayDone] = useState(false);
  const [flashBlock, setFlashBlock] = useState<{ idx: number; type: 'right' | 'wrong' } | null>(null);
  const [currentProcess, setCurrentProcess] = useState<MemoryProcess | null>(null);
  const [selectedSetIdx, setSelectedSetIdx] = useState(0);
  const [playStarted, setPlayStarted] = useState(false);

  const getActiveData = useCallback((overrideIdx?: number) => {
    if (useCustom) return { blocks: cloneBlocks(customBlocks), processes: customProcesses };
    const s = STAGE_DATA[stage][overrideIdx ?? selectedSetIdx];
    return { blocks: cloneBlocks(s.blocks), processes: s.processes };
  }, [useCustom, customBlocks, customProcesses, stage, selectedSetIdx]);

  /* ── SIMULATION ───────────────────────────────────────────── */
  function startSimulation(algo: MemoryAlgorithm) {
    setAlgorithm(algo);
    const randomIdx = Math.floor(Math.random() * 3);
    setSelectedSetIdx(randomIdx);
    const { blocks, processes } = getActiveData(randomIdx);
    setSimBlocks(blocks);
    setSimProcesses(processes);
    setSimStep(0);
    setSimHistory([]);
    setBreakdown([]);
    setProcessed([]);
    setUnprocessed([]);
    setSimMessage(`${getAlgorithmLabel(algo)}: Press STEP to allocate the next process.`);
    setScreen('simulation');
  }

  function doSimStep(
    algo: MemoryAlgorithm,
    blocks: MemoryBlock[],
    processes: MemoryProcess[],
    step: number,
    history: typeof simHistory,
    proc: MemoryProcess[],
    unproc: typeof unprocessed
  ) {
    if (step >= processes.length) {
      setSimMessage('All processes processed. See breakdown below.');
      const bd = generateMemoryBreakdown(algo, blocks, history);
      setBreakdown(bd);
      return;
    }
    const process = processes[step];
    let targetIdx = findTargetBlock(blocks, process, algo);
    let newBlocks = blocks;

    if (targetIdx === -1 && useCompaction && getTotalFreeMemory(blocks) >= process.size) {
      newBlocks = compactBlocks(blocks);
      targetIdx = findTargetBlock(newBlocks, process, algo);
      setSimMessage(`Memory compacted! Retrying ${process.name}...`);
    }

    const newStep = step + 1;

    if (targetIdx === -1) {
      const reason = `${getAlgorithmLabel(algo)} found no valid block`;
      const newUnproc = [...unproc, { ...process, reason }];
      setUnprocessed(newUnproc);
      setSimStep(newStep);
      const freeBlocks = newBlocks.filter(b => !b.used);
      const largest = freeBlocks.length > 0 ? Math.max(...freeBlocks.map(b => b.size)) : 0;
      setSimMessage(`Cannot allocate ${process.name} (${process.size} MB) — largest free block is only ${largest} MB. No block fits.`);
      if (newStep >= processes.length) {
        const bd = generateMemoryBreakdown(algo, newBlocks, history);
        setBreakdown(bd);
      }
      return;
    }

    const leftover = newBlocks[targetIdx].size - process.size;
    const newHistory = [...history, { process, blockIndex: targetIdx, leftover }];
    const allocated = allocateToBlock(newBlocks, process, targetIdx);
    const newProc = [...proc, process];

    setSimBlocks(allocated);
    setSimHistory(newHistory);
    setSimStep(newStep);
    setProcessed(newProc);

    let allocReason: string;
    const freeEligible = newBlocks.map((b, i) => ({ b, i })).filter(({ b }) => !b.used && b.size >= process.size);
    if (algo === 'firstFit') {
      const skipped = newBlocks.slice(0, targetIdx).filter(b => !b.used && b.size < process.size).length;
      const skipNote = skipped > 0 ? ` (${skipped} block(s) too small, skipped)` : '';
      allocReason = `First Fit: scanning left to right${skipNote}. Block ${targetIdx + 1} (${newBlocks[targetIdx].size} MB) is first to fit ${process.name} (${process.size} MB). Leftover: ${leftover} MB.`;
    } else if (algo === 'bestFit') {
      const comparison = freeEligible.map(({ b, i }) => `B${i + 1}:${b.size}MB→${b.size - process.size}left`).join(', ');
      allocReason = `Best Fit: all free blocks compared — [${comparison}]. Block ${targetIdx + 1} has smallest leftover (${leftover} MB) → allocated.`;
    } else {
      const comparison = freeEligible.map(({ b, i }) => `B${i + 1}:${b.size}MB`).join(', ');
      allocReason = `Worst Fit: picks largest free block to maximise leftover. Eligible: [${comparison}]. Block ${targetIdx + 1} (${newBlocks[targetIdx].size} MB) is largest → ${process.name} allocated. Leftover: ${leftover} MB.`;
    }
    setSimMessage(allocReason);

    if (newStep >= processes.length) {
      const bd = generateMemoryBreakdown(algo, allocated, newHistory);
      setBreakdown(bd);
      setSimMessage(`${getAlgorithmLabel(algo)} complete! ${newProc.length} processes allocated.`);
    }
  }

  /* ── PLAY ─────────────────────────────────────────────────── */
  function startPlay(algo: MemoryAlgorithm) {
    setAlgorithm(algo);
    const randomIdx = Math.floor(Math.random() * 3);
    setSelectedSetIdx(randomIdx);
    const { blocks, processes } = getActiveData(randomIdx);
    const [firstProc, ...rest] = processes;
    setPlayBlocks(blocks);
    setPlayProcesses(processes);
    setPlayQueue(rest);
    setCurrentProcess(firstProc);
    setHearts(MAX_HEARTS);
    setScore(0);
    setPlayDone(false);
    setFlashBlock(null);
    setTimerRunning(false);
    setPlayStarted(false);
    setPlayMessage(`Click START to begin!`);
    setScreen('play');
  }

  function handleStartPlay() {
    setPlayStarted(true);
    setTimerKey(k => k + 1);
    setTimerRunning(true);
    if (currentProcess) {
      setPlayMessage(`Allocate ${currentProcess.name} (${currentProcess.size} MB) using ${getAlgorithmLabel(algorithm)}.`);
    }
  }

  function handleBlockClick(
    blockIdx: number,
    proc: MemoryProcess,
    blocks: MemoryBlock[],
    queue: MemoryProcess[],
    h: number,
    s: number
  ) {
    if (!proc || playDone) return;

    const correctIdx = findTargetBlock(blocks, proc, algorithm);
    setTimerRunning(false);

    if (blockIdx === correctIdx) {
      setFlashBlock({ idx: blockIdx, type: 'right' });
      setTimeout(() => setFlashBlock(null), 500);
      const leftover = blocks[blockIdx].size - proc.size;
      const newBlocks = allocateToBlock(blocks, proc, blockIdx);
      const newScore = s + 10;
      setPlayBlocks(newBlocks);
      setScore(newScore);

      if (queue.length === 0) {
        setPlayDone(true);
        setTimerRunning(false);
        setCurrentProcess(null);
        setPlayMessage(`All processes allocated! Final score: ${newScore}. 🏆`);
        saveMemPlay(newScore, h, blocks, queue.length + 1);
      } else {
        const [nextProc, ...rest] = queue;
        const newQueue = rest;

        // Check if next process can actually be allocated
        const nextIdx = findTargetBlock(newBlocks, nextProc, algorithm);
        if (nextIdx === -1 && (!useCompaction || getTotalFreeMemory(newBlocks) < nextProc.size)) {
          setPlayQueue(newQueue);
          setCurrentProcess(nextProc);
          setPlayMessage(`No valid block for ${nextProc.name}! Skipping...`);
          setTimeout(() => {
            setCurrentProcess(newQueue.length > 0 ? newQueue[0] : null);
            if (newQueue.length === 0) {
              setPlayDone(true);
              saveMemPlay(newScore, h, newBlocks, queue.length + 1);
            } else {
              const [n, ...r] = newQueue;
              setCurrentProcess(n);
              setPlayQueue(r);
              setTimerKey(k => k + 1);
              setTimerRunning(true);
              setPlayMessage(`Allocate ${n.name} (${n.size} MB) using ${getAlgorithmLabel(algorithm)}.`);
            }
          }, 1000);
          return;
        }

        setPlayBlocks(newBlocks);
        setPlayQueue(newQueue);
        setCurrentProcess(nextProc);
        setPlayMessage(`✓ ${proc.name} → Block ${blockIdx + 1} (leftover: ${leftover} MB). Next: ${nextProc.name}.`);
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
          setPlayMessage(`Allocate ${nextProc.name} (${nextProc.size} MB) using ${getAlgorithmLabel(algorithm)}.`);
        }, 700);
      }
    } else {
      setFlashBlock({ idx: blockIdx, type: 'wrong' });
      setTimeout(() => setFlashBlock(null), 500);
      const newH = h - 1;
      setHearts(newH);
      const newScore = Math.max(0, s - 5);
      setScore(newScore);
      const correctInfo = correctIdx === -1
        ? 'No valid block exists — all free blocks are too small.'
        : `Correct block is Block ${correctIdx + 1} (${blocks[correctIdx].size} MB).`;
      setPlayMessage(`✗ Wrong! -1 heart. ${correctInfo}`);
      if (newH <= 0) {
        setPlayDone(true);
        setTimerRunning(false);
        setPlayMessage('GAME OVER! No hearts remaining.');
        saveMemPlay(newScore, 0, blocks, 0);
      } else {
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
        }, 700);
      }
    }
  }

  function handlePlayTimeout(proc: MemoryProcess, blocks: MemoryBlock[], queue: MemoryProcess[], h: number, s: number) {
    const newH = h - 1;
    setHearts(newH);
    const newScore = Math.max(0, s - 5);
    setScore(newScore);
    const correctIdx = findTargetBlock(blocks, proc, algorithm);
    setPlayMessage(`TIME OUT! Correct block: ${correctIdx === -1 ? 'NONE' : `Block ${correctIdx + 1}`}. -1 heart.`);

    if (newH <= 0) {
      setPlayDone(true);
      setTimerRunning(false);
      saveMemPlay(newScore, 0, blocks, 0);
    } else {
      if (queue.length === 0) {
        setPlayDone(true);
        saveMemPlay(newScore, newH, blocks, 0);
      } else {
        const [nextProc, ...rest] = queue;
        setCurrentProcess(nextProc);
        setPlayQueue(rest);
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
          setPlayMessage(`Allocate ${nextProc.name} (${nextProc.size} MB) using ${getAlgorithmLabel(algorithm)}.`);
        }, 800);
      }
    }
  }

  async function saveMemPlay(s: number, h: number, blocks: MemoryBlock[], proc: number) {
    try {
      await fetch('/api/memory/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, stageType: stage, score: s, hearts: h, processed: proc, unprocessed: 0 }),
      });
    } catch { /* silent */ }
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>MEMORY ALLOCATION</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
          <button id="memPlayMode" className="topic-card-pixel" onClick={() => { setMode('play'); setScreen('stageSelect'); }}
            style={{ backgroundImage: "url('/assets/topic_select_blue.png')", backgroundSize: '100% 100%', imageRendering: 'pixelated' }}>
            <div className="topic-card-content"><span className="topic-icon">▶</span><strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed challenge — click the correct memory block</small></div>
          </button>
          <button id="memSimMode" className="topic-card-pixel" onClick={() => { setMode('simulation'); setScreen('algoSelect'); }}
            style={{ backgroundImage: "url('/assets/topic_select_red.png')", backgroundSize: '100% 100%', imageRendering: 'pixelated' }}>
            <div className="topic-card-content"><span className="topic-icon">⚙</span><strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step memory allocation visualiser</small></div>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← BACK</button></div>
      </div>
    </div>
  );

  if (screen === 'stageSelect') return (
    <DifficultySelect
      title="MEMORY ALLOCATION"
      descriptions={{
        easy:   '3 blocks · 3 processes · 8s timer',
        normal: '5 blocks · 5 processes · 5s timer',
        hard:   '6 blocks · 6 processes · 3s timer',
      }}
      onSelect={(d) => { setStage(d); setScreen('algoSelect'); }}
      onBack={() => setScreen('modeSelect')}
    />
  );

  if (screen === 'algoSelect') {
    const algos: { id: MemoryAlgorithm; label: string; desc: string }[] = [
      { id: 'firstFit', label: 'FIRST FIT', desc: 'Click the FIRST free block large enough.' },
      { id: 'bestFit', label: 'BEST FIT', desc: 'Click the SMALLEST free block that fits.' },
      { id: 'worstFit', label: 'WORST FIT', desc: 'Click the LARGEST free block available.' },
    ];

    function updateBlock(idx: number, size: number) {
      const updated = customBlocks.map((b, i) => i === idx ? { ...b, size } : b);
      setCustomBlocks(updated);
    }
    function addBlock() {
      if (customBlocks.length >= 8) return;
      setCustomBlocks([...customBlocks, { size: 100, used: false, processName: null, usedSize: 0 }]);
    }
    function removeBlock(idx: number) {
      if (customBlocks.length <= 2) return;
      setCustomBlocks(customBlocks.filter((_, i) => i !== idx));
    }
    function updateProc(idx: number, field: 'name' | 'size', value: string) {
      const updated = customProcesses.map((p, i) => i === idx ? { ...p, [field]: field === 'size' ? Number(value) : value } : p);
      setCustomProcesses(updated);
    }
    function addProc() {
      if (customProcesses.length >= 8) return;
      const nextId = Math.max(...customProcesses.map(p => p.id)) + 1;
      setCustomProcesses([...customProcesses, { id: nextId, name: `proc${nextId}.exe`, size: 80 }]);
    }
    function removeProc(idx: number) {
      if (customProcesses.length <= 1) return;
      setCustomProcesses(customProcesses.filter((_, i) => i !== idx));
    }

    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(12px,2vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(16px,2.5vw,28px)', marginBottom: 8 }}>MEMORY ALLOCATION</h1>
          <p style={{ textAlign: 'center', color: 'var(--cyan)', marginBottom: 24 }}>Choose an allocation algorithm.</p>

          <details className="input-form-wrapper" style={{ marginBottom: 20 }}>
            <summary>CUSTOM DATA INPUT (optional override)</summary>
            <div style={{ marginTop: 14 }}>
              <div className="form-field">
                <label htmlFor="memUseCustom">Use custom memory blocks and process list</label>
                <JustifiedText className="helper-text">
                  When this option is enabled, the simulation and play mode will use your custom memory configuration instead of the default stage data. Define the size of each free memory block in megabytes and specify the name and size of each process that needs to be allocated. This override applies to both Play and Simulation modes.
                </JustifiedText>
                <input id="memUseCustom" type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} style={{ marginTop: 8 }} />
                <span style={{ marginLeft: 8, color: 'var(--cyan)', fontSize: 12 }}>{useCustom ? 'CUSTOM DATA ACTIVE' : 'USING STAGE DEFAULTS'}</span>
              </div>

              <div className="form-field">
                <label htmlFor="memCompaction">Enable Memory Compaction</label>
                <JustifiedText className="helper-text">
                  When compaction is enabled, if a process cannot be allocated due to fragmented free memory — even though the total free space is sufficient — the simulator will automatically compact all free blocks into a single contiguous region and retry the allocation. This simulates the OS memory compaction operation.
                </JustifiedText>
                <input id="memCompaction" type="checkbox" checked={useCompaction} onChange={e => setUseCompaction(e.target.checked)} style={{ marginTop: 8 }} />
                <span style={{ marginLeft: 8, color: useCompaction ? 'var(--success)' : '#7a8ab0', fontSize: 12 }}>
                  {useCompaction ? 'COMPACTION ENABLED' : 'COMPACTION DISABLED'}
                </span>
              </div>

              {useCustom && (
                <>
                  <h3 style={{ color: 'var(--cyan)', fontSize: 13, marginBottom: 8 }}>MEMORY BLOCKS</h3>
                  {customBlocks.map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ color: '#b8c7ff', fontSize: 12, minWidth: 70, textAlign: 'right' }}>Block {i + 1} (MB):</label>
                      <input className="form-input" type="number" min={10} max={1000} value={b.size} onChange={e => updateBlock(i, Number(e.target.value))} style={{ width: 90 }} />
                      <button className="btn btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '4px 8px' }} onClick={() => removeBlock(i)}>✕</button>
                    </div>
                  ))}
                  <button className="btn btn-sm" onClick={addBlock} disabled={customBlocks.length >= 8}>+ ADD BLOCK</button>

                  <h3 style={{ color: 'var(--cyan)', fontSize: 13, margin: '16px 0 8px' }}>PROCESS LIST</h3>
                  {customProcesses.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                      <input className="form-input" type="text" value={p.name} onChange={e => updateProc(i, 'name', e.target.value)} style={{ width: 130 }} />
                      <label style={{ color: '#b8c7ff', fontSize: 12 }}>MB:</label>
                      <input className="form-input" type="number" min={10} max={500} value={p.size} onChange={e => updateProc(i, 'size', e.target.value)} style={{ width: 80 }} />
                      <button className="btn btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '4px 8px' }} onClick={() => removeProc(i)}>✕</button>
                    </div>
                  ))}
                  <button className="btn btn-sm" onClick={addProc} disabled={customProcesses.length >= 8}>+ ADD PROCESS</button>
                </>
              )}
            </div>
          </details>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
            {algos.map(a => (
              <button key={a.id} id={`mem-algo-${a.id}`} className="algo-card" onClick={() => mode === 'simulation' ? startSimulation(a.id) : startPlay(a.id)}>
                <strong>{a.label}</strong><small>{a.desc}</small>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-sm" onClick={() => setScreen(mode === 'play' ? 'stageSelect' : 'modeSelect')}>← BACK</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'simulation') {
    const { processes } = useCustom ? { processes: customProcesses } : STAGE_DATA[stage][selectedSetIdx];
    const done = simStep >= processes.length;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <GameHeader moduleName="MEMORY ALLOCATION" algorithmLabel={getAlgorithmLabel(algorithm)} modeLabel="SIMULATION" onExit={() => router.push('/?topic=true')} exitButtonId="memSimExit" />
        <main className="simulation-layout">
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>MEMORY BLOCKS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                {simBlocks.map((b, i) => (
                  <div key={i} className={`memory-block ${b.used ? 'used' : 'free'}`} style={{ cursor: 'default' }}>
                    <span className="mem-label label-title">BLOCK {i + 1}</span>
                    <span className="mem-label label-size">{b.size} MB</span>
                    {b.used && <span className="mem-label label-proc">{b.processName}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>PROCESS QUEUE</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {processes.map((p, i) => (
                  <div key={p.id} className={`queue-card ${i === simStep ? 'active-queue-card' : ''}`} style={{ opacity: i < simStep ? 0.5 : 1, minWidth: 110 }}>
                    <strong style={{ color: i < simStep ? 'var(--success)' : 'var(--pink)', display: 'block' }}>
                      {i < simStep ? '✓' : i === simStep ? '▶' : ''} {p.name}
                    </strong>
                    <span style={{ display: 'block', fontSize: 12, marginTop: 4 }}>{p.size} MB</span>
                  </div>
                ))}
              </div>
            </div>

            {(processed.length > 0 || unprocessed.length > 0) && (
              <div className="results-panel-bg" style={{ border: '2px solid var(--border)' }}>
                <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>RESULTS</h2>
                {processed.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ color: 'var(--success)', fontSize: 12, marginBottom: 4 }}>✓ Allocated ({processed.length}): {processed.map(p => p.name).join(', ')}</p>
                  </div>
                )}
                {unprocessed.length > 0 && (
                  <div>
                    <p style={{ color: 'var(--danger)', fontSize: 12 }}>✗ Failed ({unprocessed.length}): {unprocessed.map(p => `${p.name} (${p.size} MB)`).join(', ')}</p>
                  </div>
                )}
                {done && <MathBreakdownPanel steps={breakdown} />}
              </div>
            )}
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>SIM CONTROL</h2>
            <button
              className="btn"
              disabled={done}
              onClick={() => doSimStep(algorithm, simBlocks, simProcesses, simStep, simHistory, processed, unprocessed)}
            >
              STEP
            </button>
            <button className="btn btn-sm" onClick={() => startSimulation(algorithm)}>RESTART</button>
            <div className="rule-box">
              <span>RULE</span>
              <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>{getAlgorithmRule(algorithm)}</JustifiedText>
            </div>
            <div className="message-box" style={{ fontSize: 12 }}>{simMessage}</div>
          </section>
        </main>
      </div>
    );
  }

  if (screen === 'play') {
    const correctIdx = currentProcess ? findTargetBlock(playBlocks, currentProcess, algorithm) : -1;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <GameHeader moduleName="MEMORY ALLOCATION" algorithmLabel={getAlgorithmLabel(algorithm)} modeLabel={`PLAY (${stage.toUpperCase()})`} onExit={() => router.push('/?topic=true')} exitButtonId="memPlayExit" />
        <main className="play-layout">
          {/* Left: status */}
          <section className="panel">
            <h2 style={{ fontSize: 14 }}>SYSTEM</h2>
            <div className="stat-block"><span>HEARTS</span><HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} /></div>
            <div className="stat-block"><span>SCORE</span><strong>{score}</strong></div>
            <div className="stat-block"><span>REMAINING</span><strong>{playQueue.length + (currentProcess ? 1 : 0)}</strong></div>
          </section>

          {/* Center: timer + memory blocks */}
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!playDone && currentProcess && (
              <TimerBar
                key={timerKey}
                seconds={TIMER_BY_DIFFICULTY[stage]}
                running={timerRunning}
                onExpire={() => handlePlayTimeout(currentProcess, playBlocks, playQueue, hearts, score)}
              />
            )}

            {currentProcess && (
              <div style={{ background: 'rgba(255,42,109,0.1)', border: '2px solid var(--pink)', padding: 12, textAlign: 'center' }}>
                <span style={{ color: 'var(--pink)', fontSize: 13 }}>CURRENT PROCESS</span>
                <strong style={{ display: 'block', color: 'var(--yellow)', fontSize: 22, margin: '4px 0' }}>{currentProcess.name}</strong>
                <span style={{ color: 'var(--white)' }}>{currentProcess.size} MB</span>
              </div>
            )}

            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>
                MEMORY — Click the correct block!
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
                {playBlocks.map((b, i) => {
                  const isFlashRight = flashBlock?.idx === i && flashBlock.type === 'right';
                  const isFlashWrong = flashBlock?.idx === i && flashBlock.type === 'wrong';
                  return (
                    <button
                      key={i}
                      id={`mem-block-${i}`}
                      className={`memory-block ${b.used ? 'used' : 'free'} ${isFlashRight ? 'correct-flash' : isFlashWrong ? 'wrong-flash' : ''}`}
                      onClick={() => !b.used && currentProcess && !playDone && handleBlockClick(i, currentProcess, playBlocks, playQueue, hearts, score)}
                      disabled={b.used || playDone || !currentProcess}
                      style={{
                        outline: isFlashRight ? '4px solid var(--success)' : isFlashWrong ? '4px solid var(--danger)' : undefined,
                        cursor: b.used || playDone ? 'default' : 'pointer',
                      }}
                    >
                      <span className="mem-label label-title">BLOCK {i + 1}</span>
                      <span className="mem-label label-size">{b.size} MB</span>
                      {b.used && <span className="mem-label label-proc">{b.processName}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Process queue */}
            {playQueue.length > 0 && (
              <div style={{ border: '2px solid var(--border)', padding: 12 }}>
                <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>UPCOMING</h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {playQueue.map(p => (
                    <div key={p.id} className="queue-card" style={{ minHeight: 'auto', padding: '8px 12px', minWidth: 100 }}>
                      <strong style={{ display: 'block', color: 'var(--pink)' }}>{p.name}</strong>
                      <span style={{ fontSize: 12 }}>{p.size} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right: controls */}
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>CONTROL</h2>
            <div className="rule-box">
              <span>RULE</span>
              <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>{getAlgorithmRule(algorithm)}</JustifiedText>
            </div>
            <div className="message-box" style={{ fontSize: 12 }}>{playMessage}</div>
            {playDone && (
              <>
                <button id="memPlayRestart" className="btn" onClick={() => startPlay(algorithm)}>PLAY AGAIN</button>
                <button id="memPlayExit" className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← MENU</button>
              </>
            )}
          </section>
        </main>
        {!playStarted && !playDone && (
          <div className="modal-overlay">
             <div className="modal-card" style={{ textAlign: 'center', width: 'auto' }}>
                <h2>READY?</h2>
                <p style={{ color: 'var(--cyan)' }}>Take a moment to prepare.</p>
                <button className="btn btn-lg btn-yellow" onClick={handleStartPlay} style={{ marginTop: 24 }}>START GAME</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
