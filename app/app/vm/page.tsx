'use client';

// app/vm/page.tsx — Virtual Memory topic page (Play + Simulation + Custom Input)

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TimerBar } from '@/components/ui/TimerBar';
import { HeartDisplay } from '@/components/ui/HeartDisplay';
import { MathBreakdownPanel } from '@/components/ui/MathBreakdownPanel';
import { JustifiedText } from '@/components/ui/JustifiedText';
import {
  runVmSimulation,
  findVictim,
  getVmAlgoLabel,
  getVmAlgoInfo,
  DEFAULT_VM_REFERENCE_STRING,
  DEFAULT_VM_FRAME_COUNT,
} from '@/lib/vm/algorithms';
import { generateVmBreakdown } from '@/lib/vm/breakdown';
import type { VmAlgorithm, VmSimResult, VmStepState } from '@/lib/vm/types';
import type { BreakdownStep } from '@/lib/vm/breakdown';
import { MAX_HEARTS, TIMER_BY_DIFFICULTY } from '@/lib/game/constants';
import { DifficultySelect } from '@/components/ui/DifficultySelect';
import { GameHeader } from '@/components/ui/GameHeader';

type Screen = 'modeSelect' | 'algoSelect' | 'simulation' | 'play' | 'stageSelect';

const VM_SETS: Record<'easy' | 'normal' | 'hard', { refString: number[]; frames: number }[]> = {
  easy: [
    // Set A — two hits at end after frames fill up
    { refString: [1, 2, 3, 4, 1, 2], frames: 3 },
    // Set B — hit in the middle before frames are full (page 1 hits at pos 2)
    { refString: [1, 2, 1, 3, 2, 4], frames: 3 },
    // Set C — page 3 is a hit, then fault wave, then page 2 hits late
    { refString: [3, 2, 1, 3, 4, 2], frames: 3 },
  ],
  normal: [
    // Set A — Silberschatz classic (FIFO=15, LRU=12, OPT=9 faults)
    { refString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], frames: 3 },
    // Set B — shows Bélády's anomaly for FIFO with 4 frames; interesting FIFO vs LRU divergence
    { refString: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8], frames: 3 },
    // Set C — mixed locality with decent hit rate
    { refString: [0, 1, 2, 0, 3, 1, 2, 4, 0, 3, 1, 5, 2, 0, 3, 4, 1, 2, 5, 0], frames: 3 },
  ],
  hard: [
    // Set A — varied locality, OPT saves ~4 faults vs FIFO
    { refString: [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2, 0, 1, 5, 3, 4, 2, 1, 0, 3, 5, 2, 1], frames: 3 },
    // Set B — high page count, low locality; algorithms diverge significantly
    { refString: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 0, 1, 2, 4, 5, 0, 3, 4, 1, 2, 5, 3, 0, 1], frames: 3 },
    // Set C — two distinct working sets that shift mid-sequence
    { refString: [1, 2, 3, 1, 2, 3, 1, 2, 4, 5, 4, 5, 4, 0, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0], frames: 3 },
  ],
};

export default function VmPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [mode, setMode] = useState<'play' | 'simulation'>('simulation');
  const [algorithm, setAlgorithm] = useState<VmAlgorithm>('fifo');
  const [stage, setStage] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Custom input
  const [customRefString, setCustomRefString] = useState(DEFAULT_VM_REFERENCE_STRING.join(' '));
  const [customFrameCount, setCustomFrameCount] = useState(DEFAULT_VM_FRAME_COUNT);
  const [useCustom, setUseCustom] = useState(false);

  // Derived config
  const activeRef = () => {
    if (!useCustom) return DEFAULT_VM_REFERENCE_STRING;
    const parsed = customRefString.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0);
    return parsed.length > 0 ? parsed : DEFAULT_VM_REFERENCE_STRING;
  };
  const activeFrames = () => (useCustom ? customFrameCount : DEFAULT_VM_FRAME_COUNT);

  // Simulation state
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [simResult, setSimResult] = useState<VmSimResult | null>(null);
  const [simStep, setSimStep] = useState(0);
  const [simMessage, setSimMessage] = useState('Press STEP to process the next page reference.');
  const [breakdown, setBreakdown] = useState<BreakdownStep[]>([]);
  const [algoInfo, setAlgoInfo] = useState('');
  const [autoRunning, setAutoRunning] = useState(false);

  // Play state
  const [playRef, setPlayRef] = useState<number[]>([]);
  const [playFrames, setPlayFrames] = useState<(number | null)[]>([]);
  const [playFifoOrder, setPlayFifoOrder] = useState<number[]>([]);
  const [playRecency, setPlayRecency] = useState<number[]>([]);
  const [playIndex, setPlayIndex] = useState(0);
  const [playFaults, setPlayFaults] = useState(0);
  const [playHits, setPlayHits] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [score, setScore] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playMessage, setPlayMessage] = useState('');
  const [playDone, setPlayDone] = useState(false);
  const [needsChoice, setNeedsChoice] = useState(false);
  const [correctVictim, setCorrectVictim] = useState(-1);
  const [flashRight, setFlashRight] = useState(-1);
  const [flashWrong, setFlashWrong] = useState(-1);
  const [playLog, setPlayLog] = useState<('hit' | 'fault' | 'auto')[]>([]);
  const [playStarted, setPlayStarted] = useState(false);

  /* ── SIMULATION ───────────────────────────────────────────── */
  function startSim(algo: VmAlgorithm) {
    if (autoIntervalRef.current) { clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
    setAlgorithm(algo);
    const ref = activeRef();
    const fc = activeFrames();
    const result = runVmSimulation(algo, ref, fc);
    setSimResult(result);
    setSimStep(0);
    setSimMessage('Press STEP to process the next page reference.');
    setBreakdown([]);
    setAlgoInfo(getVmAlgoInfo(algo));
    setAutoRunning(false);
    setScreen('simulation');
  }

  function doSimStep(result: VmSimResult, step: number) {
    if (step >= result.steps.length) {
      const bd = generateVmBreakdown(algorithm, result);
      setBreakdown(bd);
      setSimMessage(`${getVmAlgoLabel(algorithm)} complete. ${result.faults} page faults out of ${result.referenceString.length}.`);
      setAutoRunning(false);
      return;
    }
    const s = result.steps[step];
    setSimStep(step + 1);
    setSimMessage(s.message);
    if (step + 1 === result.steps.length) {
      const bd = generateVmBreakdown(algorithm, result);
      setBreakdown(bd);
      setAutoRunning(false);
    }
  }

  function toggleVmAuto() {
    if (!simResult) return;
    if (autoRunning) {
      setAutoRunning(false);
      if (autoIntervalRef.current) { clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
      return;
    }
    setAutoRunning(true);
    const result = simResult;
    let step = simStep;
    const id = setInterval(() => {
      if (step >= result.steps.length) { clearInterval(id); setAutoRunning(false); return; }
      const s = result.steps[step];
      setSimStep(step + 1);
      setSimMessage(s.message);
      step++;
      if (step === result.steps.length) {
        clearInterval(id);
        autoIntervalRef.current = null;
        setAutoRunning(false);
        const bd = generateVmBreakdown(algorithm, result);
        setBreakdown(bd);
      }
    }, 700);
    autoIntervalRef.current = id;
  }

  /* ── PLAY ─────────────────────────────────────────────────── */
  function startPlay(algo: VmAlgorithm) {
    setAlgorithm(algo);
    const sets = VM_SETS[stage];
    const chosen = sets[Math.floor(Math.random() * sets.length)];
    const ref = [...chosen.refString];
    const fc = chosen.frames;
    setPlayRef(ref);
    setPlayFrames(new Array(fc).fill(null));
    setPlayFifoOrder([]);
    setPlayRecency(new Array(fc).fill(-1));
    setPlayIndex(0);
    setPlayFaults(0);
    setPlayHits(0);
    setHearts(MAX_HEARTS);
    setScore(0);
    setPlayDone(false);
    setNeedsChoice(false);
    setPlayLog([]);
    setTimerRunning(false);
    setPlayStarted(false);
    setPlayMessage('Click START to begin!');
    setScreen('play');
  }

  function handleStartPlay() {
    setPlayStarted(true);
    setTimerRunning(true);
    setTimerKey(k => k + 1);
    setPlayMessage('Process the next page reference!');
    setTimeout(() => advancePlayStep(playFrames, playFifoOrder, playRecency, playIndex, playFaults, playHits, playLog, hearts, score, playRef), 0);
  }

  function advancePlayStep(
    frames: (number | null)[], fifo: number[], recency: number[],
    index: number, faults: number, hits: number, log: ('hit' | 'fault' | 'auto')[], h: number, s: number,
    refString: number[]
  ) {
    if (index >= refString.length) {
      setPlayDone(true);
      setTimerRunning(false);
      setPlayMessage(`Done! ${faults} page faults, ${hits} hits. Hit ratio: ${((hits / refString.length) * 100).toFixed(1)}%`);
      saveVmPlay(s, h, faults, hits, refString.length);
      return;
    }

    const page = refString[index];
    const frameIdx = frames.indexOf(page);

    if (frameIdx !== -1) {
      // HIT — auto-advance
      const newRecency = [...recency];
      newRecency[frameIdx] = index;
      const newLog = [...log, 'hit' as const];
      const newHits = hits + 1;
      setPlayFrames([...frames]);
      setPlayRecency(newRecency);
      setPlayIndex(index + 1);
      setPlayHits(newHits);
      setPlayLog(newLog);
      setPlayMessage(`Page ${page} → HIT! Already in Frame ${frameIdx + 1}. Auto-advancing...`);
      setTimeout(() => advancePlayStep(frames, fifo, newRecency, index + 1, faults, newHits, newLog, h, s, refString), 600);
    } else {
      const emptySlot = frames.indexOf(null);
      if (emptySlot !== -1) {
        // Load into empty frame — auto
        const newFrames = [...frames];
        newFrames[emptySlot] = page;
        const newFifo = [...fifo, emptySlot];
        const newRecency = [...recency];
        newRecency[emptySlot] = index;
        const newFaults = faults + 1;
        const newLog = [...log, 'auto' as const];
        setPlayFrames(newFrames);
        setPlayFifoOrder(newFifo);
        setPlayRecency(newRecency);
        setPlayIndex(index + 1);
        setPlayFaults(newFaults);
        setPlayLog(newLog);
        setPlayMessage(`Page ${page} → FAULT! Loaded into empty Frame ${emptySlot + 1}.`);
        setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, index + 1, newFaults, hits, newLog, h, s, refString), 600);
      } else {
        // FAULT — player must choose victim
        const victim = findVictim(algorithm, frames as number[], fifo, recency, refString, index);
        setCorrectVictim(victim);
        setNeedsChoice(true);
        setTimerKey(k => k + 1);
        setTimerRunning(true);
        setPlayMessage(`Page ${page} → FAULT! Which frame should be evicted?`);
        setPlayFaults(faults + 1);
        // DO NOT PUSH TO playLog YET! Wait for user choice.
      }
    }
  }

  function handleFrameClick(frameIdx: number) {
    if (!needsChoice || playDone) return;
    setTimerRunning(false);
    setNeedsChoice(false);

    const page = playRef[playIndex];
    if (frameIdx === correctVictim) {
      setFlashRight(frameIdx);
      setTimeout(() => setFlashRight(-1), 500);
      const newFrames = [...playFrames];
      const oldPage = newFrames[frameIdx];
      newFrames[frameIdx] = page;
      const newRecency = [...playRecency];
      newRecency[frameIdx] = playIndex;
      let newFifo = [...playFifoOrder];
      if (algorithm === 'fifo') {
        newFifo = newFifo.filter(f => f !== frameIdx);
        newFifo.push(frameIdx);
      }
      const newScore = score + 10;
      setScore(newScore);
      setPlayFrames(newFrames);
      setPlayRecency(newRecency);
      setPlayFifoOrder(newFifo);
      const newIdx = playIndex + 1;
      setPlayIndex(newIdx);
      const newLog = [...playLog, 'fault' as const];
      setPlayLog(newLog);
      setPlayMessage(`✓ Correct! Page ${oldPage} evicted from Frame ${frameIdx + 1}.`);
      setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, newIdx, playFaults, playHits, newLog, hearts, newScore, playRef), 700);
    } else {
      setFlashWrong(frameIdx);
      setTimeout(() => setFlashWrong(-1), 500);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setScore(s => Math.max(0, s - 5));
      setPlayMessage(`✗ Wrong frame! -1 heart. ${getVmAlgoLabel(algorithm)} would evict Frame ${correctVictim + 1}.`);
      if (newHearts <= 0) {
        setPlayDone(true);
        setPlayMessage('GAME OVER!');
        const newLog = [...playLog, 'fault' as const];
        setPlayLog(newLog);
        saveVmPlay(Math.max(0, score - 5), 0, playFaults, playHits, playRef.length);
      } else {
        setTimeout(() => {
          setNeedsChoice(true);
          setTimerKey(k => k + 1);
          setTimerRunning(true);
        }, 800);
      }
    }
  }

  function handlePlayTimeout() {
    if (!needsChoice) return;
    const newHearts = hearts - 1;
    setHearts(newHearts);
    setNeedsChoice(false);
    setPlayMessage(`TIME OUT! -1 heart. Correct answer was Frame ${correctVictim + 1}.`);
    
    const newLog = [...playLog, 'fault' as const];
    setPlayLog(newLog);

    if (newHearts <= 0) {
      setPlayDone(true);
      setTimerRunning(false);
      saveVmPlay(Math.max(0, score - 5), 0, playFaults, playHits, playRef.length);
    } else {
      // Auto-apply correct victim and continue
      const page = playRef[playIndex];
      const newFrames = [...playFrames];
      newFrames[correctVictim] = page;
      const newRecency = [...playRecency]; newRecency[correctVictim] = playIndex;
      let newFifo = [...playFifoOrder];
      if (algorithm === 'fifo') { newFifo = newFifo.filter(f => f !== correctVictim); newFifo.push(correctVictim); }
      setPlayFrames(newFrames);
      setPlayRecency(newRecency);
      setPlayFifoOrder(newFifo);
      const newIdx = playIndex + 1;
      setPlayIndex(newIdx);
      setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, newIdx, playFaults, playHits, newLog, newHearts, score, playRef), 800);
    }
  }

  async function saveVmPlay(s: number, h: number, faults: number, hits: number, total: number) {
    try {
      await fetch('/api/vm/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, score: s, hearts: h, pageFaults: faults, hits, totalRefs: total, hitRatio: hits / total, frameCount: activeFrames() }),
      });
    } catch { /* silent */ }
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>VIRTUAL MEMORY</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
          <button id="vmPlayMode" className="topic-card-pixel" onClick={() => { setMode('play'); setScreen('stageSelect'); }}
            style={{ backgroundImage: "url('/assets/topic_select_blue.png')", backgroundSize: '100% 100%', imageRendering: 'pixelated' }}>
            <div className="topic-card-content"><span className="topic-icon">▶</span><strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed — click the correct victim frame to evict</small></div>
          </button>
          <button id="vmSimMode" className="topic-card-pixel" onClick={() => { setMode('simulation'); setScreen('algoSelect'); }}
            style={{ backgroundImage: "url('/assets/topic_select_red.png')", backgroundSize: '100% 100%', imageRendering: 'pixelated' }}>
            <div className="topic-card-content"><span className="topic-icon">⚙</span><strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step page replacement visualiser</small></div>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← BACK</button></div>
      </div>
    </div>
  );

  if (screen === 'stageSelect') return (
    <DifficultySelect
      title="VIRTUAL MEMORY"
      onSelect={d => { setStage(d); setScreen('algoSelect'); }}
      onBack={() => setScreen('modeSelect')}
      descriptions={{
        easy:   `6 page refs · ${TIMER_BY_DIFFICULTY.easy}s per choice`,
        normal: `20 page refs · ${TIMER_BY_DIFFICULTY.normal}s per choice`,
        hard:   `24 page refs · ${TIMER_BY_DIFFICULTY.hard}s per choice`,
      }}
    />
  );

  if (screen === 'algoSelect') {
    const algos: { id: VmAlgorithm; label: string; desc: string }[] = [
      { id: 'fifo', label: 'FIFO', desc: 'Replace the page resident longest.' },
      { id: 'lru', label: 'LRU', desc: 'Replace the least recently used page.' },
      { id: 'optimal', label: 'OPTIMAL', desc: 'Replace the page used farthest in the future.' },
    ];
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(12px,2vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(16px,2.5vw,28px)', marginBottom: 8 }}>VIRTUAL MEMORY</h1>
          <p style={{ textAlign: 'center', color: 'var(--cyan)', marginBottom: 24 }}>Choose a page replacement algorithm.</p>

          {mode === 'simulation' && <details className="input-form-wrapper" style={{ marginBottom: 20 }}>
            <summary>CUSTOM DATA INPUT (optional override)</summary>
            <div style={{ marginTop: 14 }}>
              <div className="form-field">
                <label htmlFor="vmUseCustom">Use custom reference string and frame count</label>
                <JustifiedText className="helper-text">
                  By default, the simulator uses a 20-element reference string with 3 frames. Enable this option to supply your own sequence of page numbers and specify the number of available memory frames. The reference string must be a space or comma-separated list of non-negative integers, and the frame count must be between 1 and 5.
                </JustifiedText>
                <input id="vmUseCustom" type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} style={{ marginTop: 8 }} />
                <span style={{ marginLeft: 8, color: 'var(--cyan)', fontSize: 12 }}>{useCustom ? 'CUSTOM DATA ACTIVE' : 'USING DEFAULTS'}</span>
              </div>
              {useCustom && (
                <>
                  <div className="form-field">
                    <label htmlFor="vmRefInput">Reference String (space or comma separated integers)</label>
                    <JustifiedText className="helper-text">
                      Enter the sequence of virtual page numbers that the simulated process will request. Each number corresponds to a virtual page identifier. The simulator will process these references one by one, tracking page faults and hits according to the selected replacement algorithm.
                    </JustifiedText>
                    <textarea
                      id="vmRefInput"
                      className="form-input"
                      rows={3}
                      value={customRefString}
                      onChange={e => setCustomRefString(e.target.value)}
                      style={{ marginTop: 6, resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="vmFrameCount">Number of Frames: {customFrameCount}</label>
                    <JustifiedText className="helper-text">
                      The frame count defines how many page frames are available in physical memory. A higher frame count generally reduces page faults due to Bélády&apos;s rule (except in the anomalous FIFO case). Adjust this to explore how frame size affects algorithm performance.
                    </JustifiedText>
                    <input id="vmFrameCount" className="form-input" type="range" min={1} max={5} value={customFrameCount} onChange={e => setCustomFrameCount(Number(e.target.value))} style={{ width: '100%', marginTop: 6 }} />
                  </div>
                </>
              )}
            </div>
          </details>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
            {algos.map(a => (
              <button key={a.id} id={`vm-algo-${a.id}`} className="algo-card" onClick={() => mode === 'simulation' ? startSim(a.id) : startPlay(a.id)}>
                <strong>{a.label}</strong><small>{a.desc}</small>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => setScreen(mode === 'play' ? 'stageSelect' : 'modeSelect')}>← BACK</button></div>
        </div>
      </div>
    );
  }

  if (screen === 'simulation' && simResult) {
    const currentFrames = simStep > 0 ? simResult.steps[simStep - 1].frameSlots : new Array(activeFrames()).fill(null);
    const done = simStep >= simResult.steps.length;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <GameHeader moduleName="VIRTUAL MEMORY" algorithmLabel={getVmAlgoLabel(algorithm)} modeLabel="SIMULATION" onExit={() => router.push('/?topic=true')} />
        <main className="simulation-layout">
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>REFERENCE STRING</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {simResult.referenceString.map((p, i) => {
                  let cls = 'ref-cell';
                  if (i < simStep) cls += simResult.steps[i].log === 'hit' ? ' hit' : ' fault';
                  if (i === simStep) cls += ' current';
                  return <div key={i} className={cls}>{p}</div>;
                })}
              </div>
            </div>
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>FRAMES</h2>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeFrames()}, 1fr)`, gap: 10 }}>
                {currentFrames.map((page, i) => (
                  <div key={i} className={`memory-block vm-frame ${page === null ? 'empty' : 'filled'}`} style={{ cursor: 'default', position: 'relative' }}>
                    <span className="mem-label label-title">FRAME {i + 1}</span>
                    <span className="mem-label label-size">{page === null ? 'EMPTY' : `PAGE ${page}`}</span>
                  </div>
                ))}
              </div>
            </div>
            {done && (
              <div className="results-panel-bg" style={{ border: '2px solid var(--border)' }}>
                <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>RESULTS</h2>
                <table className="results-table">
                  <thead><tr><th>Total Refs</th><th>Page Faults</th><th>Hits</th><th>Hit Ratio</th><th>Fault Ratio</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>{simResult.referenceString.length}</td>
                      <td>{simResult.faults}</td>
                      <td>{simResult.hits}</td>
                      <td>{(simResult.hitRatio * 100).toFixed(1)}%</td>
                      <td>{(simResult.faultRatio * 100).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
                <MathBreakdownPanel steps={breakdown} />
              </div>
            )}
          </section>
          <section className="panel sim-control-panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>SIM CONTROL</h2>
            <button className="btn" onClick={() => simResult && doSimStep(simResult, simStep)} disabled={done}>STEP</button>
            <button className={`btn ${autoRunning ? 'btn-yellow' : 'btn-pink'}`} onClick={toggleVmAuto} disabled={done}>{autoRunning ? 'STOP AUTO' : 'AUTO RUN'}</button>
            <button className="btn btn-sm" onClick={() => startSim(algorithm)}>RESTART</button>
            <div className="rule-box">
              <span>ALGORITHM INFO</span>
              <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>{algoInfo}</JustifiedText>
            </div>
            <div className="message-box" style={{ fontSize: 12 }}>{simMessage}</div>
          </section>
        </main>
      </div>
    );
  }

  if (screen === 'play') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <GameHeader moduleName="VIRTUAL MEMORY" algorithmLabel={getVmAlgoLabel(algorithm)} modeLabel="PLAY MODE" onExit={() => router.push('/?topic=true')} />
        <main className="play-layout">
          <section className="panel system-panel">
            <h2 style={{ fontSize: 14 }}>SYSTEM</h2>
            <div className="stat-row">
              <div className="stat-block"><span>HEARTS</span><HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} /></div>
              <div className="stat-block"><span>SCORE</span><strong>{score}</strong></div>
              <div className="stat-block"><span>FAULTS</span><strong>{playFaults}</strong></div>
              <div className="stat-block"><span>HITS</span><strong>{playHits}</strong></div>
              <div className="stat-block"><span>INDEX</span><strong>{playIndex}/{playRef.length}</strong></div>
            </div>
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!playDone && (
              <TimerBar key={timerKey} seconds={TIMER_BY_DIFFICULTY[stage]} running={timerRunning && needsChoice} onExpire={handlePlayTimeout} />
            )}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>REFERENCE STRING</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {playRef.map((p, i) => {
                  let cls = 'ref-cell';
                  if (i < playLog.length) {
                    const status = playLog[i];
                    if (status === 'hit' || status === 'auto') {
                      cls += ' hit';
                    } else if (status === 'fault') {
                      cls += ' fault';
                    }
                  }
                  if (i === playIndex) cls += ' current';
                  return <div key={i} className={cls}>{p}</div>;
                })}
              </div>
            </div>
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>
                FRAMES {needsChoice ? '— Click the frame to evict!' : ''}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${playFrames.length}, 1fr)`, gap: 10 }}>
                {playFrames.map((page, i) => {
                  const isRight = flashRight === i;
                  const isWrong = flashWrong === i;
                  return (
                    <button
                      key={i}
                      id={`vm-frame-${i}`}
                      className={`memory-block vm-frame ${page === null ? 'empty' : 'filled'} ${isRight ? 'correct-flash' : isWrong ? 'wrong-flash' : ''}`}
                      onClick={() => handleFrameClick(i)}
                      disabled={!needsChoice || playDone}
                      style={{
                        position: 'relative',
                        cursor: needsChoice && !playDone ? 'pointer' : 'default',
                        border: needsChoice ? '3px solid var(--yellow)' : undefined,
                        outline: isRight ? '4px solid var(--success)' : isWrong ? '4px solid var(--danger)' : undefined,
                      }}
                    >
                      <span className="mem-label label-title">FRAME {i + 1}</span>
                      <span className="mem-label label-size">{page === null ? 'EMPTY' : `PAGE ${page}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>CONTROL</h2>
            <div className="rule-box">
              <span>RULE</span>
              <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>
                {`On a page fault with full frames, click the frame that ${getVmAlgoLabel(algorithm)} would evict.`}
              </JustifiedText>
            </div>
            <div className="message-box" style={{ fontSize: 12 }}>{playMessage}</div>
            {playDone && (
              <>
                <button className="btn" onClick={() => startPlay(algorithm)}>PLAY AGAIN</button>
                <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← MENU</button>
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
