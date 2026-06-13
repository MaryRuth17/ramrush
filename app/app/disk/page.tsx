'use client';

// app/disk/page.tsx — Disk Scheduling topic page (Play + Simulation + Custom Input)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimerBar } from '@/components/ui/TimerBar';
import { HeartDisplay } from '@/components/ui/HeartDisplay';
import { MathBreakdownPanel } from '@/components/ui/MathBreakdownPanel';
import { JustifiedText } from '@/components/ui/JustifiedText';
import {
  runDiskSimulation,
  computeDiskOrder,
  getDiskAlgoLabel,
  getDiskAlgoInfo,
  DEFAULT_DISK_REQUESTS,
  DEFAULT_DISK_HEAD_START,
  DISK_MAX_TRACK,
} from '@/lib/disk/algorithms';
import { generateDiskBreakdown } from '@/lib/disk/breakdown';
import type { DiskAlgorithm, DiskSimResult } from '@/lib/disk/types';
import type { BreakdownStep } from '@/lib/disk/breakdown';

type Screen = 'modeSelect' | 'algoSelect' | 'simulation' | 'play';
const MAX_HEARTS = 3;
const TIME_LIMIT = 5;

export default function DiskPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [mode, setMode] = useState<'play' | 'simulation'>('simulation');
  const [algorithm, setAlgorithm] = useState<DiskAlgorithm>('fcfs');

  // Custom input
  const [customRequests, setCustomRequests] = useState(DEFAULT_DISK_REQUESTS.join(', '));
  const [customHead, setCustomHead] = useState(DEFAULT_DISK_HEAD_START);
  const [useCustom, setUseCustom] = useState(false);

  const activeRequests = () => {
    if (!useCustom) return DEFAULT_DISK_REQUESTS;
    const parsed = customRequests.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n <= DISK_MAX_TRACK);
    return parsed.length > 0 ? parsed : DEFAULT_DISK_REQUESTS;
  };
  const activeHead = () => useCustom ? customHead : DEFAULT_DISK_HEAD_START;

  // Simulation state
  const [simResult, setSimResult] = useState<DiskSimResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [simMessage, setSimMessage] = useState('Press STEP to move the disk head.');
  const [breakdown, setBreakdown] = useState<BreakdownStep[]>([]);
  const [algoInfo, setAlgoInfo] = useState('');
  const [autoRunning, setAutoRunning] = useState(false);

  // Play state
  const [playOrder, setPlayOrder] = useState<number[]>([]);
  const [playRequests, setPlayRequests] = useState<number[]>([]);
  const [playHead, setPlayHead] = useState(DEFAULT_DISK_HEAD_START);
  const [playStep, setPlayStep] = useState(0);
  const [playVisited, setPlayVisited] = useState<number[]>([]);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [score, setScore] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playMessage, setPlayMessage] = useState('');
  const [playDone, setPlayDone] = useState(false);
  const [flashRight, setFlashRight] = useState(-1);
  const [flashWrong, setFlashWrong] = useState(-1);
  const [totalMoved, setTotalMoved] = useState(0);

  /* ── SIMULATION ───────────────────────────────────────────── */
  function startSim(algo: DiskAlgorithm) {
    setAlgorithm(algo);
    const reqs = activeRequests();
    const head = activeHead();
    const result = runDiskSimulation(algo, reqs, head);
    setSimResult(result);
    setRevealed(0);
    setSimMessage('Press STEP to move the disk head.');
    setBreakdown([]);
    setAlgoInfo(getDiskAlgoInfo(algo));
    setAutoRunning(false);
    setScreen('simulation');
  }

  function doSimStep(result: DiskSimResult, rev: number) {
    if (rev >= result.order.length) {
      setSimMessage('All requests serviced. Press RESTART to run again.');
      const bd = generateDiskBreakdown(algorithm, result);
      setBreakdown(bd);
      setAutoRunning(false);
      return;
    }
    const prev = rev === 0 ? result.headStart : result.order[rev - 1];
    const next = result.order[rev];
    const newRev = rev + 1;
    setRevealed(newRev);
    setSimMessage(`Head moves from track ${prev} to track ${next} (${Math.abs(next - prev)} tracks).`);
    if (newRev === result.order.length) {
      setSimMessage(`${getDiskAlgoLabel(algorithm)} complete. Total movement: ${result.totalMovement} tracks.`);
      const bd = generateDiskBreakdown(algorithm, result);
      setBreakdown(bd);
      setAutoRunning(false);
    }
  }

  function toggleDiskAuto() {
    if (!simResult) return;
    if (autoRunning) { setAutoRunning(false); return; }
    setAutoRunning(true);
    let rev = revealed;
    const result = simResult;
    const id = setInterval(() => {
      if (rev >= result.order.length) { clearInterval(id); setAutoRunning(false); return; }
      const prev = rev === 0 ? result.headStart : result.order[rev - 1];
      const next = result.order[rev];
      rev++;
      setRevealed(rev);
      setSimMessage(`Head moves from track ${prev} to track ${next} (${Math.abs(next - prev)} tracks).`);
      if (rev === result.order.length) {
        clearInterval(id);
        setAutoRunning(false);
        setSimMessage(`${getDiskAlgoLabel(algorithm)} complete. Total movement: ${result.totalMovement} tracks.`);
        const bd = generateDiskBreakdown(algorithm, result);
        setBreakdown(bd);
      }
    }, 700);
  }

  /* ── PLAY ─────────────────────────────────────────────────── */
  function startPlay(algo: DiskAlgorithm) {
    setAlgorithm(algo);
    const reqs = activeRequests();
    const head = activeHead();
    const order = computeDiskOrder(algo, reqs, head);
    setPlayRequests(reqs);
    setPlayOrder(order);
    setPlayHead(head);
    setPlayStep(0);
    setPlayVisited([]);
    setHearts(MAX_HEARTS);
    setScore(0);
    setPlayDone(false);
    setTotalMoved(0);
    setTimerKey(k => k + 1);
    setTimerRunning(true);
    setPlayMessage(`Click the next track the head should visit!`);
    setScreen('play');
  }

  function handleTrackClick(track: number, step: number, visited: number[], head: number, moved: number, h: number, s: number) {
    if (playDone) return;
    const correct = playOrder[step];
    setTimerRunning(false);

    if (track === correct) {
      setFlashRight(track);
      setTimeout(() => setFlashRight(-1), 500);
      const newVisited = [...visited, track];
      const movement = Math.abs(track - head);
      const newMoved = moved + movement;
      const newScore = s + 10;
      const newStep = step + 1;
      setPlayVisited(newVisited);
      setPlayHead(track);
      setTotalMoved(newMoved);
      setScore(newScore);
      setPlayStep(newStep);
      setPlayMessage(`✓ Correct! Head → Track ${track} (${movement} tracks). Total: ${newMoved}.`);

      if (newStep >= playOrder.length) {
        setPlayDone(true);
        setTimerRunning(false);
        setPlayMessage(`Complete! Total head movement: ${newMoved} tracks. Score: ${newScore}.`);
        saveDiskPlay(newScore, h, newMoved);
      } else {
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
          setPlayMessage(`Click the next track the head should visit!`);
        }, 700);
      }
    } else {
      setFlashWrong(track);
      setTimeout(() => setFlashWrong(-1), 500);
      const newHearts = h - 1;
      setHearts(newHearts);
      setScore(Math.max(0, s - 5));
      setPlayMessage(`✗ Wrong! -1 heart. ${getDiskAlgoLabel(algorithm)} would go to Track ${correct}.`);
      if (newHearts <= 0) {
        setPlayDone(true);
        setTimerRunning(false);
        setPlayMessage('GAME OVER!');
        saveDiskPlay(Math.max(0, s - 5), 0, moved);
      } else {
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
        }, 800);
      }
    }
  }

  function handleDiskTimeout(step: number, visited: number[], head: number, moved: number, h: number, s: number) {
    const newHearts = h - 1;
    setHearts(newHearts);
    setScore(Math.max(0, s - 5));
    const correct = playOrder[step];
    setPlayMessage(`TIME OUT! Correct: Track ${correct}. -1 heart.`);
    if (newHearts <= 0) {
      setPlayDone(true);
      setTimerRunning(false);
      saveDiskPlay(Math.max(0, s - 5), 0, moved);
    } else {
      // Auto-skip
      const newVisited = [...visited, correct];
      const movement = Math.abs(correct - head);
      const newMoved = moved + movement;
      const newStep = step + 1;
      setPlayVisited(newVisited);
      setPlayHead(correct);
      setTotalMoved(newMoved);
      setPlayStep(newStep);
      if (newStep >= playOrder.length) {
        setPlayDone(true);
        setTimerRunning(false);
        saveDiskPlay(Math.max(0, s - 5), newHearts, newMoved);
      } else {
        setTimeout(() => {
          setTimerKey(k => k + 1);
          setTimerRunning(true);
          setPlayMessage('Click the next track!');
        }, 800);
      }
    }
  }

  async function saveDiskPlay(s: number, h: number, moved: number) {
    // Database saving has been disabled as requested
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>DISK SCHEDULING</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 18, marginBottom: 24 }}>
          <button id="diskPlayMode" className="topic-card cyan-card" onClick={() => { setMode('play'); setScreen('algoSelect'); }}>
            <span className="topic-icon">▶</span><strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed — click the correct next disk track mark</small>
          </button>
          <button id="diskSimMode" className="topic-card pink-card" onClick={() => { setMode('simulation'); setScreen('algoSelect'); }}>
            <span className="topic-icon">⚙</span><strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step disk head movement visualiser</small>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>← BACK</button></div>
      </div>
    </div>
  );

  if (screen === 'algoSelect') {
    const algos: { id: DiskAlgorithm; label: string; desc: string }[] = [
      { id: 'fcfs', label: 'FCFS', desc: 'Service requests in arrival order.' },
      { id: 'sstf', label: 'SSTF', desc: 'Always service the closest request.' },
      { id: 'scan', label: 'SCAN', desc: 'Sweep toward higher tracks, then reverse.' },
      { id: 'cscan', label: 'C-SCAN', desc: 'Sweep up, jump back to 0, continue up.' },
      { id: 'look', label: 'LOOK', desc: 'Reverse at last request, not disk end.' },
    ];
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(12px,2vw,24px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(16px,2.5vw,28px)', marginBottom: 8 }}>DISK SCHEDULING</h1>
          <p style={{ textAlign: 'center', color: 'var(--cyan)', marginBottom: 24 }}>Choose a disk scheduling algorithm.</p>
          <details className="input-form-wrapper" style={{ marginBottom: 20 }}>
            <summary>CUSTOM DATA INPUT (optional override)</summary>
            <div style={{ marginTop: 14 }}>
              <div className="form-field">
                <label htmlFor="diskUseCustom">Use custom track requests and head start position</label>
                <JustifiedText className="helper-text">
                  By default, the simulation uses eight track requests with the disk head starting at track 53, spanning a 200-track disk (0–199). Enable this option to specify your own set of pending I/O requests and the starting head position. Track numbers must be integers in the range 0 to 199, entered as a comma or space-separated list.
                </JustifiedText>
                <input id="diskUseCustom" type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} style={{ marginTop: 8 }} />
                <span style={{ marginLeft: 8, color: 'var(--cyan)', fontSize: 12 }}>{useCustom ? 'CUSTOM DATA ACTIVE' : 'USING DEFAULTS'}</span>
              </div>
              {useCustom && (
                <>
                  <div className="form-field">
                    <label htmlFor="diskRequests">Track Requests (comma or space separated, 0–199)</label>
                    <JustifiedText className="helper-text">
                      Enter the set of disk track numbers that have pending I/O requests. These represent the cylinder numbers that the disk head must visit. The order in which you list them does not matter for SSTF, SCAN, C-SCAN, and LOOK, but is significant for FCFS which services them in the exact order provided.
                    </JustifiedText>
                    <input id="diskRequests" className="form-input" type="text" value={customRequests} onChange={e => setCustomRequests(e.target.value)} style={{ marginTop: 6 }} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="diskHead">Head Start Position (0–199): {customHead}</label>
                    <JustifiedText className="helper-text">
                      The initial position of the disk read/write head expressed as a track number. All head movement calculations begin from this position. For SCAN and LOOK algorithms, the head initially moves toward higher-numbered tracks from this starting position.
                    </JustifiedText>
                    <input id="diskHead" className="form-input" type="range" min={0} max={199} value={customHead} onChange={e => setCustomHead(Number(e.target.value))} style={{ width: '100%', marginTop: 6 }} />
                  </div>
                </>
              )}
            </div>
          </details>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
            {algos.map(a => (
              <button key={a.id} id={`disk-algo-${a.id}`} className="algo-card" onClick={() => mode === 'simulation' ? startSim(a.id) : startPlay(a.id)}>
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
    const pct = (t: number) => (t / DISK_MAX_TRACK) * 100;
    const currentPos = revealed === 0 ? simResult.headStart : simResult.order[revealed - 1];
    const done = revealed >= simResult.order.length;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <header className="game-header">
          <div><h1>DISK SCHEDULING</h1><p>{getDiskAlgoLabel(algorithm)} — SIMULATION</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
        <main className="simulation-layout">
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Request queue */}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>
                REQUEST QUEUE (HEAD START = {simResult.headStart})
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {simResult.requests.map((t, i) => (
                  <div key={i} className="queue-card" style={{ minHeight: 'auto', padding: '8px 12px' }}>
                    <strong style={{ color: 'var(--pink)', display: 'block' }}>TRACK</strong>
                    <span style={{ color: 'var(--white)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disk track line */}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>
                DISK TRACK (0 – {DISK_MAX_TRACK})
              </h2>
              <div className="disk-line">
                {/* Start marker */}
                <div className="disk-mark" style={{ left: `${pct(simResult.headStart)}%`, background: 'var(--yellow)' }}>
                  <span>START {simResult.headStart}</span>
                </div>
                {simResult.requests.map((t, i) => {
                  const visited = simResult.order.slice(0, revealed).includes(t);
                  return (
                    <div key={i} className={`disk-mark ${visited ? 'visited' : ''}`} style={{ left: `${pct(t)}%` }}>
                      <span>{t}</span>
                    </div>
                  );
                })}
                <div className="disk-head" style={{ left: `${pct(currentPos)}%` }} />
              </div>
            </div>

            {/* Service order */}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>SERVICE ORDER</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {simResult.order.map((t, i) => (
                  <div key={i} className={`queue-card ${i < revealed ? 'order-card visited' : 'order-card'}`} style={{ minHeight: 'auto', padding: '8px 12px', borderColor: i < revealed ? 'var(--success)' : undefined, background: i < revealed ? '#173322' : undefined }}>
                    <strong style={{ display: 'block', color: 'var(--pink)', marginBottom: 2 }}>STEP {i + 1}</strong>
                    <span style={{ color: 'var(--white)', fontSize: 12 }}>Track {t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            {done && (
              <div style={{ border: '2px solid var(--border)', padding: 12 }}>
                <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>RESULTS</h2>
                <table className="results-table">
                  <thead><tr><th>Service Order</th><th>Total Head Movement</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>{simResult.headStart} → {simResult.order.join(' → ')}</td>
                      <td>{simResult.totalMovement} tracks</td>
                    </tr>
                  </tbody>
                </table>
                <MathBreakdownPanel steps={breakdown} />
              </div>
            )}
          </section>
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>SIM CONTROL</h2>
            <button className="btn" onClick={() => simResult && doSimStep(simResult, revealed)} disabled={done}>STEP</button>
            <button className="btn btn-pink" onClick={toggleDiskAuto} disabled={done}>{autoRunning ? 'STOP AUTO' : 'AUTO RUN'}</button>
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
    const pct = (t: number) => (t / DISK_MAX_TRACK) * 100;
    const nextCorrect = playStep < playOrder.length ? playOrder[playStep] : -1;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
        <header className="game-header">
          <div><h1>DISK SCHEDULING</h1><p>{getDiskAlgoLabel(algorithm)} — PLAY MODE</p></div>
          <button className="btn btn-sm" onClick={() => router.push('/?topic=true')}>EXIT</button>
        </header>
        <main className="play-layout">
          <section className="panel">
            <h2 style={{ fontSize: 14 }}>SYSTEM</h2>
            <div className="stat-block"><span>HEARTS</span><HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} /></div>
            <div className="stat-block"><span>SCORE</span><strong>{score}</strong></div>
            <div className="stat-block"><span>STEP</span><strong>{playStep}/{playOrder.length}</strong></div>
            <div className="stat-block"><span>MOVED</span><strong>{totalMoved} tracks</strong></div>
            <div className="stat-block"><span>HEAD</span><strong>Track {playHead}</strong></div>
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!playDone && (
              <TimerBar
                key={timerKey}
                seconds={TIME_LIMIT}
                running={timerRunning}
                onExpire={() => handleDiskTimeout(playStep, playVisited, playHead, totalMoved, hearts, score)}
              />
            )}
            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>
                DISK TRACK — Click the next track to visit!
              </h2>
              <div className="disk-line" style={{ height: 100 }}>
                <div className="disk-mark" style={{ left: `${pct(activeHead())}%`, background: 'var(--yellow)' }}>
                  <span>START {activeHead()}</span>
                </div>
                {playRequests.map((t, i) => {
                  const visited = playVisited.includes(t);
                  const isRight = flashRight === t;
                  const isWrong = flashWrong === t;
                  return (
                    <div
                      key={i}
                      className={`disk-mark clickable ${visited ? 'visited' : ''}`}
                      style={{
                        left: `${pct(t)}%`,
                        background: isRight ? 'var(--success)' : isWrong ? 'var(--danger)' : visited ? 'var(--success)' : 'var(--violet)',
                        cursor: !playDone && !visited ? 'pointer' : 'default',
                        width: 4,
                      }}
                      onClick={() => !playDone && !visited && handleTrackClick(t, playStep, playVisited, playHead, totalMoved, hearts, score)}
                    >
                      <span style={{ fontWeight: 'bold', color: t === nextCorrect && !playDone ? 'var(--yellow)' : 'var(--white)' }}>{t}</span>
                    </div>
                  );
                })}
                <div className="disk-head" style={{ left: `${pct(playHead)}%` }} />
              </div>
            </div>

            <div style={{ border: '2px solid var(--border)', padding: 12 }}>
              <h2 style={{ fontSize: 14, color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12 }}>SERVICE ORDER</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {playOrder.map((t, i) => (
                  <div key={i} className="queue-card" style={{ minHeight: 'auto', padding: '6px 10px', borderColor: i < playStep ? 'var(--success)' : i === playStep ? 'var(--yellow)' : 'var(--violet)', background: i < playStep ? '#173322' : 'var(--terminal-black)' }}>
                    <strong style={{ display: 'block', color: i < playStep ? 'var(--success)' : 'var(--pink)', marginBottom: 2, fontSize: 11 }}>STEP {i + 1}</strong>
                    <span style={{ fontSize: 12, color: i === playStep ? 'var(--yellow)' : 'var(--white)' }}>Track {t}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 14 }}>CONTROL</h2>
            <div className="rule-box">
              <span>RULE</span>
              <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>
                {`Click the track mark that ${getDiskAlgoLabel(algorithm)} would service next. Track marks glow yellow when it is your turn to pick.`}
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
