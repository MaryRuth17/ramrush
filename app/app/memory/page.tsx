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

type Screen = 'modeSelect' | 'stageSelect' | 'algoSelect' | 'play' | 'simulation';
const MAX_HEARTS = 3;
const TIME_LIMIT = 5;

const DEFAULT_MEMORY: MemoryBlock[] = [
  { size: 120, used: false, processName: null, usedSize: 0 },
  { size: 200, used: false, processName: null, usedSize: 0 },
  { size: 300, used: false, processName: null, usedSize: 0 },
  { size: 150, used: false, processName: null, usedSize: 0 },
  { size: 250, used: false, processName: null, usedSize: 0 },
];

const STAGE_DATA: Record<'easy' | 'normal' | 'hard', { blocks: MemoryBlock[]; processes: MemoryProcess[] }> = {
  easy: {
    blocks: [
      { size: 200, used: false, processName: null, usedSize: 0 },
      { size: 150, used: false, processName: null, usedSize: 0 },
      { size: 300, used: false, processName: null, usedSize: 0 },
    ],
    processes: [
      { id: 1, name: 'notepad.exe', size: 80 },
      { id: 2, name: 'calc.exe', size: 140 },
      { id: 3, name: 'paint.exe', size: 120 },
    ],
  },
  normal: {
    blocks: DEFAULT_MEMORY,
    processes: [
      { id: 1, name: 'chrome.exe', size: 180 },
      { id: 2, name: 'discord.exe', size: 95 },
      { id: 3, name: 'spotify.exe', size: 80 },
      { id: 4, name: 'code.exe', size: 140 },
      { id: 5, name: 'photoshop.exe', size: 260 },
    ],
  },
  hard: {
    blocks: [
      { size: 80, used: false, processName: null, usedSize: 0 },
      { size: 60, used: false, processName: null, usedSize: 0 },
      { size: 200, used: false, processName: null, usedSize: 0 },
      { size: 120, used: false, processName: null, usedSize: 0 },
      { size: 170, used: false, processName: null, usedSize: 0 },
      { size: 50, used: false, processName: null, usedSize: 0 },
    ],
    processes: [
      { id: 1, name: 'chrome.exe', size: 75 },
      { id: 2, name: 'vscode.exe', size: 110 },
      { id: 3, name: 'steam.exe', size: 180 },
      { id: 4, name: 'discord.exe', size: 55 },
      { id: 5, name: 'obs.exe', size: 160 },
      { id: 6, name: 'zoom.exe', size: 90 },
    ],
  },
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
  const [gameStarted, setGameStarted] = useState(false);

  const getActiveData = useCallback(() => {
    if (useCustom) return { blocks: cloneBlocks(customBlocks), processes: customProcesses };
    const s = STAGE_DATA[stage];
    return { blocks: cloneBlocks(s.blocks), processes: s.processes };
  }, [useCustom, customBlocks, customProcesses, stage]);

  /* ── SIMULATION ───────────────────────────────────────────── */
  function startSimulation(algo: MemoryAlgorithm) {
    setAlgorithm(algo);
    const { blocks, processes } = getActiveData();
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
      setSimMessage(`Cannot allocate ${process.name} (${process.size} MB) — no suitable block found.`);
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
    setSimMessage(`Allocated ${process.name} (${process.size} MB) → Block ${targetIdx + 1}. Leftover: ${leftover} MB.`);

    if (newStep >= processes.length) {
      const bd = generateMemoryBreakdown(algo, allocated, newHistory);
      setBreakdown(bd);
      setSimMessage(`${getAlgorithmLabel(algo)} complete! ${newProc.length} processes allocated.`);
    }
  }

  /* ── PLAY ─────────────────────────────────────────────────── */
  function startPlay(algo: MemoryAlgorithm) {
    setAlgorithm(algo);
    const { blocks, processes } = getActiveData();
    const [firstProc, ...rest] = processes;
    setPlayBlocks(blocks);
    setPlayProcesses(processes);
    setPlayQueue(rest);
    setCurrentProcess(firstProc);
    setHearts(MAX_HEARTS);
    setScore(0);
    setPlayDone(false);
    setFlashBlock(null);
    setGameStarted(false);
    setTimerKey(k => k + 1);
    setTimerRunning(false);
    setPlayMessage('Press START GAME to begin!');
    setScreen('play');
  }

  function handleStartGame() {
    setGameStarted(true);
    setTimerRunning(true);
    setPlayMessage(`Allocate ${currentProcess?.name} (${currentProcess?.size} MB) using ${getAlgorithmLabel(algorithm)}.`);
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
    // Database saving has been disabled as requested
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>MEMORY ALLOCATION</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
          <button id="memPlayMode" className="topic-card cyan-card" onClick={() => { setMode('play'); setScreen('stageSelect'); }}>
            <span className="topic-icon">▶</span><strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed challenge — click the correct memory block</small>
          </button>
          <button id="memSimMode" className="topic-card pink-card" onClick={() => { setMode('simulation'); setScreen('algoSelect'); }}>
            <span className="topic-icon">⚙</span><strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step memory allocation visualiser</small>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← BACK</button></div>
      </div>
    </div>
  );

  if (screen === 'stageSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,28px)', marginBottom: 32 }}>SELECT STAGE</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 18, marginBottom: 24 }}>
          {(['easy', 'normal', 'hard'] as const).map(s => (
            <button key={s} id={`mem-stage-${s}`} className="algo-card" onClick={() => { setStage(s); setScreen('algoSelect'); }}>
              <strong>{s.toUpperCase()}</strong>
              <small>{s === 'easy' ? '3 blocks, 3 processes' : s === 'normal' ? '5 blocks, 5 processes' : '6 blocks, 6 processes — tight fits!'}</small>
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => setScreen('modeSelect')}>← BACK</button></div>
      </div>
    </div>
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
    const { processes } = useCustom ? { processes: customProcesses } : STAGE_DATA[stage];
    const done = simStep >= processes.length;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <header className="game-header">
          <div><h1>MEMORY ALLOCATION</h1><p>{getAlgorithmLabel(algorithm)} — SIMULATION</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
        <main className="simulation-layout">
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>MEMORY BLOCKS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                {simBlocks.map((b, i) => (
                  <div key={i} className={`memory-block ${b.used ? 'used' : 'free'}`} style={{ cursor: 'default' }}>
                    <strong style={{ display: 'block' }}>BLOCK {i + 1}</strong>
                    <span style={{ display: 'block', marginTop: 4 }}>{b.size} MB</span>
                    {b.used && <span style={{ display: 'block', fontSize: 11, marginTop: 2 }}>{b.processName}</span>}
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
              <div style={{ border: '2px solid var(--border)', padding: 12 }}>
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
        <header className="game-header">
          <div><h1>MEMORY ALLOCATION</h1><p>{getAlgorithmLabel(algorithm)} — PLAY ({stage.toUpperCase()})</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
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
                seconds={TIME_LIMIT}
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
                      disabled={!gameStarted || b.used || playDone || !currentProcess}
                      style={{
                        outline: isFlashRight ? '4px solid var(--success)' : isFlashWrong ? '4px solid var(--danger)' : undefined,
                        cursor: (!gameStarted || b.used || playDone) ? 'default' : 'pointer',
                      }}
                      onClick={() => gameStarted && !b.used && !playDone && handleBlockClick(i, currentProcess!, playBlocks, playQueue, hearts, score)}
                    >
                      <strong style={{ display: 'block', fontSize: 13 }}>BLOCK {i + 1}</strong>
                      <span style={{ display: 'block', marginTop: 4 }}>{b.size} MB</span>
                      {b.used && <span style={{ display: 'block', fontSize: 10, marginTop: 2 }}>{b.processName}</span>}
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
            
            {!gameStarted && !playDone && (
              <button className="btn btn-yellow" onClick={handleStartGame}>START GAME</button>
            )}

            {playDone && (
              <>
                <button id="memPlayRestart" className="btn" onClick={() => startPlay(algorithm)}>PLAY AGAIN</button>
                <button id="memPlayExit" className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← MENU</button>
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  return null;
}
