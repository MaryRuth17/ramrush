'use client';

// app/vm/page.tsx — Virtual Memory topic page (Play + Simulation + Custom Input)

import { useState } from 'react';
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

type Screen = 'modeSelect' | 'algoSelect' | 'simulation' | 'play';
const MAX_HEARTS = 3;
const TIME_LIMIT = 5;

export default function VmPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [mode, setMode] = useState<'play' | 'simulation'>('simulation');
  const [algorithm, setAlgorithm] = useState<VmAlgorithm>('fifo');

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
  const [playLog, setPlayLog] = useState<('hit' | 'fault')[]>([]);

  /* ── SIMULATION ───────────────────────────────────────────── */
  function startSim(algo: VmAlgorithm) {
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
    if (autoRunning) { setAutoRunning(false); return; }
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
        setAutoRunning(false);
        const bd = generateVmBreakdown(algorithm, result);
        setBreakdown(bd);
      }
    }, 700);
  }

  /* ── PLAY ─────────────────────────────────────────────────── */
  function startPlay(algo: VmAlgorithm) {
    setAlgorithm(algo);
    const ref = activeRef();
    const fc = activeFrames();
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
    setTimerKey(k => k + 1);
    setTimerRunning(true);
    setPlayMessage('Process the next page reference!');
    setScreen('play');

    setTimeout(() => {
      advancePlayStep(new Array(fc).fill(null), [], new Array(fc).fill(-1), 0, 0, 0, [], MAX_HEARTS, 0);
    }, 600);
  }

  function advancePlayStep(
    frames: (number | null)[], fifo: number[], recency: number[],
    index: number, faults: number, hits: number, log: ('hit' | 'fault')[], h: number, s: number
  ) {
    if (index >= playRef.length) {
      setPlayDone(true);
      setTimerRunning(false);
      setPlayMessage(`Done! ${faults} page faults, ${hits} hits. Hit ratio: ${((hits / playRef.length) * 100).toFixed(1)}%`);
      saveVmPlay(s, h, faults, hits, playRef.length);
      return;
    }

    const page = playRef[index];
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
      setTimeout(() => advancePlayStep(frames, fifo, newRecency, index + 1, faults, newHits, newLog, h, s), 600);
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
        const newLog = [...log, 'fault' as const];
        setPlayFrames(newFrames);
        setPlayFifoOrder(newFifo);
        setPlayRecency(newRecency);
        setPlayIndex(index + 1);
        setPlayFaults(newFaults);
        setPlayLog(newLog);
        setPlayMessage(`Page ${page} → FAULT! Loaded into empty Frame ${emptySlot + 1}.`);
        setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, index + 1, newFaults, hits, newLog, h, s), 600);
      } else {
        // FAULT — player must choose victim
        const victim = findVictim(algorithm, frames as number[], fifo, recency, playRef, index);
        setCorrectVictim(victim);
        setNeedsChoice(true);
        setTimerKey(k => k + 1);
        setTimerRunning(true);
        setPlayMessage(`Page ${page} → FAULT! Which frame should be evicted?`);
        setPlayFaults(faults + 1);
        setPlayLog([...log, 'fault' as const]);
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
      setPlayMessage(`✓ Correct! Page ${oldPage} evicted from Frame ${frameIdx + 1}.`);
      setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, newIdx, playFaults, playHits, playLog, hearts, newScore), 700);
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
      setTimeout(() => advancePlayStep(newFrames, newFifo, newRecency, newIdx, playFaults, playHits, playLog, newHearts, score), 800);
    }
  }

  async function saveVmPlay(s: number, h: number, faults: number, hits: number, total: number) {
    // Database saving has been disabled as requested
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>VIRTUAL MEMORY</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
          <button id="vmPlayMode" className="topic-card cyan-card" onClick={() => { setMode('play'); setScreen('algoSelect'); }}>
            <span className="topic-icon">▶</span><strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed — click the correct victim frame to evict</small>
          </button>
          <button id="vmSimMode" className="topic-card pink-card" onClick={() => { setMode('simulation'); setScreen('algoSelect'); }}>
            <span className="topic-icon">⚙</span><strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step page replacement visualiser</small>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← BACK</button></div>
      </div>
    </div>
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

          <details className="input-form-wrapper" style={{ marginBottom: 20 }}>
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
          </details>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
            {algos.map(a => (
              <button key={a.id} id={`vm-algo-${a.id}`} className="algo-card" onClick={() => mode === 'simulation' ? startSim(a.id) : startPlay(a.id)}>
                <strong>{a.label}</strong><small>{a.desc}</small>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => setScreen('modeSelect')}>← BACK</button></div>
        </div>
      </div>
    );
  }

  if (screen === 'simulation' && simResult) {
    const currentFrames = simStep > 0 ? simResult.steps[simStep - 1].frameSlots : new Array(activeFrames()).fill(null);
    const done = simStep >= simResult.steps.length;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <header className="game-header">
          <div><h1>VIRTUAL MEMORY</h1><p>{getVmAlgoLabel(algorithm)} — SIMULATION</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
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
                  <div key={i} className={`memory-block vm-frame ${page === null ? 'empty' : 'filled'}`} style={{ cursor: 'default' }}>
                    <strong>FRAME {i + 1}</strong>
                    <span>{page === null ? 'EMPTY' : `PAGE ${page}`}</span>
                  </div>
                ))}
              </div>
            </div>
            {done && (
              <div style={{ border: '2px solid var(--border)', padding: 12 }}>
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
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>SIM CONTROL</h2>
            <button className="btn" onClick={() => simResult && doSimStep(simResult, simStep)} disabled={done}>STEP</button>
            <button className={`btn btn-pink`} onClick={toggleVmAuto} disabled={done}>{autoRunning ? 'STOP AUTO' : 'AUTO RUN'}</button>
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
        <header className="game-header">
          <div><h1>VIRTUAL MEMORY</h1><p>{getVmAlgoLabel(algorithm)} — PLAY MODE</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
        <main className="play-layout">
          <section className="panel">
            <h2 style={{ fontSize: 14 }}>SYSTEM</h2>
            <div className="stat-block"><span>HEARTS</span><HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} /></div>
            <div className="stat-block"><span>SCORE</span><strong>{score}</strong></div>
            <div className="stat-block"><span>FAULTS</span><strong>{playFaults}</strong></div>
            <div className="stat-block"><span>HITS</span><strong>{playHits}</strong></div>
            <div className="stat-block"><span>INDEX</span><strong>{playIndex}/{playRef.length}</strong></div>
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!playDone && needsChoice && (
              <TimerBar key={timerKey} seconds={TIME_LIMIT} running={timerRunning} onExpire={handlePlayTimeout} />
            )}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>REFERENCE STRING</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {playRef.map((p, i) => {
                  let cls = 'ref-cell';
                  if (i < playLog.length) cls += playLog[i] === 'hit' ? ' hit' : ' fault';
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
                        cursor: needsChoice && !playDone ? 'pointer' : 'default',
                        border: needsChoice ? '3px solid var(--yellow)' : undefined,
                        outline: isRight ? '4px solid var(--success)' : isWrong ? '4px solid var(--danger)' : undefined,
                      }}
                    >
                      <strong>FRAME {i + 1}</strong>
                      <span>{page === null ? 'EMPTY' : `PAGE ${page}`}</span>
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
      </div>
    );
  }

  return null;
}
