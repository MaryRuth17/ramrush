'use client';

// app/cpu/page.tsx — CPU Scheduling topic page (Play + Simulation + Custom Input)

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TimerBar } from '@/components/ui/TimerBar';
import { HeartDisplay } from '@/components/ui/HeartDisplay';
import { MathBreakdownPanel } from '@/components/ui/MathBreakdownPanel';
import { JustifiedText } from '@/components/ui/JustifiedText';
import {
  computeCpuGantt,
  computeCpuStats,
  getCpuAlgoLabel,
  getCpuAlgoInfo,
  getNextCpuProcess,
  DEFAULT_CPU_PROCESSES,
  DEFAULT_CPU_QUANTUM,
} from '@/lib/cpu/algorithms';
import { generateCpuBreakdown } from '@/lib/cpu/breakdown';
import type { CpuAlgorithm, CpuProcess, GanttBlock, CpuStats } from '@/lib/cpu/types';
import type { BreakdownStep } from '@/lib/cpu/breakdown';
import { MAX_HEARTS, TIMER_BY_DIFFICULTY } from '@/lib/game/constants';
import { DifficultySelect } from '@/components/ui/DifficultySelect';
import { GameHeader } from '@/components/ui/GameHeader';

type Screen = 'modeSelect' | 'algoSelect' | 'play' | 'simulation' | 'stageSelect';

const CPU_SETS: Record<'easy' | 'normal' | 'hard', CpuProcess[][]> = {
  easy: [
    // Set A — clear ordering, good for teaching
    [
      { name: 'P1', arrival: 0, burst: 4, priority: 2 },
      { name: 'P2', arrival: 1, burst: 3, priority: 1 },
      { name: 'P3', arrival: 2, burst: 5, priority: 3 },
    ],
    // Set B — SJF tie at t=0 (P1 and P2 equal burst, tiebreak by arrival/name)
    [
      { name: 'P1', arrival: 0, burst: 3, priority: 2 },
      { name: 'P2', arrival: 0, burst: 3, priority: 1 },
      { name: 'P3', arrival: 2, burst: 6, priority: 3 },
    ],
    // Set C — priority order inverts FCFS order
    [
      { name: 'P1', arrival: 0, burst: 5, priority: 1 },
      { name: 'P2', arrival: 1, burst: 2, priority: 3 },
      { name: 'P3', arrival: 3, burst: 4, priority: 2 },
    ],
  ],
  normal: [
    // Set A — varied burst, staggered arrivals
    [
      { name: 'P1', arrival: 0, burst: 5, priority: 3 },
      { name: 'P2', arrival: 1, burst: 3, priority: 1 },
      { name: 'P3', arrival: 2, burst: 8, priority: 4 },
      { name: 'P4', arrival: 3, burst: 6, priority: 2 },
      { name: 'P5', arrival: 4, burst: 4, priority: 5 },
    ],
    // Set B — P2 and P4 tie on burst=2 for SJF
    [
      { name: 'P1', arrival: 0, burst: 6, priority: 2 },
      { name: 'P2', arrival: 2, burst: 2, priority: 4 },
      { name: 'P3', arrival: 3, burst: 8, priority: 1 },
      { name: 'P4', arrival: 4, burst: 2, priority: 3 },
      { name: 'P5', arrival: 5, burst: 5, priority: 5 },
    ],
    // Set C — priority vs SJF produce very different orders
    [
      { name: 'P1', arrival: 0, burst: 4, priority: 3 },
      { name: 'P2', arrival: 1, burst: 7, priority: 1 },
      { name: 'P3', arrival: 2, burst: 3, priority: 4 },
      { name: 'P4', arrival: 3, burst: 6, priority: 2 },
      { name: 'P5', arrival: 5, burst: 5, priority: 5 },
    ],
  ],
  hard: [
    // Set A — two processes arrive simultaneously at t=0
    [
      { name: 'P1', arrival: 0, burst: 6, priority: 4 },
      { name: 'P2', arrival: 0, burst: 2, priority: 1 },
      { name: 'P3', arrival: 1, burst: 8, priority: 3 },
      { name: 'P4', arrival: 2, burst: 3, priority: 5 },
      { name: 'P5', arrival: 3, burst: 5, priority: 2 },
      { name: 'P6', arrival: 4, burst: 4, priority: 6 },
      { name: 'P7', arrival: 5, burst: 7, priority: 1 },
    ],
    // Set B — multiple SJF ties, also P1 and P2 tie at t=0
    [
      { name: 'P1', arrival: 0, burst: 5, priority: 3 },
      { name: 'P2', arrival: 0, burst: 5, priority: 1 },
      { name: 'P3', arrival: 1, burst: 4, priority: 2 },
      { name: 'P4', arrival: 2, burst: 4, priority: 4 },
      { name: 'P5', arrival: 3, burst: 6, priority: 5 },
      { name: 'P6', arrival: 4, burst: 3, priority: 2 },
      { name: 'P7', arrival: 5, burst: 6, priority: 3 },
    ],
    // Set C — late simultaneous arrivals at t=6
    [
      { name: 'P1', arrival: 0, burst: 7, priority: 4 },
      { name: 'P2', arrival: 0, burst: 3, priority: 2 },
      { name: 'P3', arrival: 2, burst: 5, priority: 1 },
      { name: 'P4', arrival: 3, burst: 4, priority: 3 },
      { name: 'P5', arrival: 5, burst: 6, priority: 5 },
      { name: 'P6', arrival: 6, burst: 2, priority: 2 },
      { name: 'P7', arrival: 6, burst: 8, priority: 6 },
    ],
  ],
};

const DEFAULT_PROCESSES_COPY: CpuProcess[] = DEFAULT_CPU_PROCESSES.map(p => ({ ...p }));

export default function CpuPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [mode, setMode] = useState<'play' | 'simulation'>('simulation');
  const [algorithm, setAlgorithm] = useState<CpuAlgorithm>('fcfs');
  const [stage, setStage] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Custom process input
  const [customProcesses, setCustomProcesses] = useState<CpuProcess[]>(DEFAULT_PROCESSES_COPY);
  const [quantum, setQuantum] = useState(DEFAULT_CPU_QUANTUM);
  const [useCustom, setUseCustom] = useState(false);

  // Simulation state
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [gantt, setGantt] = useState<GanttBlock[]>([]);
  const [stats, setStats] = useState<CpuStats | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);
  const [simMessage, setSimMessage] = useState('Press STEP to build the Gantt chart.');
  const [breakdown, setBreakdown] = useState<BreakdownStep[]>([]);
  const [algoInfo, setAlgoInfo] = useState('');

  // Play state
  const [playProcesses, setPlayProcesses] = useState<CpuProcess[]>([]);
  const [completedNames, setCompletedNames] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [score, setScore] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playMessage, setPlayMessage] = useState('');
  const [playDone, setPlayDone] = useState(false);
  const [flashRight, setFlashRight] = useState<string | null>(null);
  const [flashWrong, setFlashWrong] = useState<string | null>(null);

  // RR-specific play state: remaining burst per process, ordered ready queue, and admission tracker
  const [rrRemaining, setRrRemaining] = useState<Record<string, number>>({});
  const [rrQueue, setRrQueue] = useState<string[]>([]);
  const [rrAdded, setRrAdded] = useState<Set<string>>(new Set());

  const activeProcesses = useCallback(() => {
    return customProcesses.length > 0 && useCustom ? customProcesses : DEFAULT_PROCESSES_COPY;
  }, [customProcesses, useCustom]);

  /* ── SIMULATION MODE ──────────────────────────────────────── */
  function startSimulation(algo: CpuAlgorithm) {
    if (autoIntervalRef.current) { clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
    setAlgorithm(algo);
    const procs = activeProcesses();
    const g = computeCpuGantt(algo, procs, quantum);
    setGantt(g);
    setStats(null);
    setRevealed(0);
    setAutoRunning(false);
    setSimMessage('Press STEP to build the Gantt chart, one slice at a time.');
    setBreakdown([]);
    setAlgoInfo(getCpuAlgoInfo(algo, quantum));
    setScreen('simulation');
  }

  function simStep(g = gantt, rev = revealed) {
    if (rev >= g.length) {
      setSimMessage('Scheduler finished. Press RESTART to run again.');
      setAutoRunning(false);
      if (!stats) {
        const s = computeCpuStats(g, activeProcesses());
        setStats(s);
        const bd = generateCpuBreakdown(algorithm, g, s, activeProcesses(), quantum);
        setBreakdown(bd);
      }
      return;
    }
    const next = rev + 1;
    setRevealed(next);
    const block = g[next - 1];
    setSimMessage(`${block.reason} Runs t=${block.start}–${block.end}.`);
    if (next === g.length) {
      const s = computeCpuStats(g, activeProcesses());
      setStats(s);
      const bd = generateCpuBreakdown(algorithm, g, s, activeProcesses(), quantum);
      setBreakdown(bd);
      setSimMessage(`${getCpuAlgoLabel(algorithm)} complete. See results below.`);
      setAutoRunning(false);
    }
  }

  function toggleAuto() {
    if (autoRunning) {
      setAutoRunning(false);
      if (autoIntervalRef.current) { clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; }
      return;
    }
    setAutoRunning(true);
    const id = setInterval(() => {
      setRevealed(prev => {
        if (prev >= gantt.length) { clearInterval(id); setAutoRunning(false); return prev; }
        const next = prev + 1;
        const block = gantt[next - 1];
        setSimMessage(`${block.reason} Runs t=${block.start}–${block.end}.`);
        if (next === gantt.length) {
          clearInterval(id);
          setAutoRunning(false);
          const s = computeCpuStats(gantt, activeProcesses());
          setStats(s);
          const bd = generateCpuBreakdown(algorithm, gantt, s, activeProcesses(), quantum);
          setBreakdown(bd);
          setSimMessage(`${getCpuAlgoLabel(algorithm)} complete. See results below.`);
        }
        return next;
      });
    }, 700);
    autoIntervalRef.current = id;
  }

  /* ── PLAY MODE ────────────────────────────────────────────── */
  function startPlay(algo: CpuAlgorithm) {
    setAlgorithm(algo);
    const sets = CPU_SETS[stage];
    const procs = sets[Math.floor(Math.random() * sets.length)];
    setPlayProcesses(procs);
    setCompletedNames([]);
    setHearts(MAX_HEARTS);
    setScore(0);
    setPlayDone(false);
    setTimerKey(k => k + 1);
    setTimerRunning(true);
    setPlayMessage('Click the process that should run next!');

    if (algo === 'rr') {
      // Mirror the reference engine's state: remaining burst, FIFO queue, admission set
      const rem: Record<string, number> = {};
      procs.forEach(p => { rem[p.name] = p.burst; });
      const added = new Set<string>();
      // If nothing arrives at time 0, auto-advance to first arrival (idle time)
      const initTime = procs.some(p => p.arrival <= 0) ? 0 : Math.min(...procs.map(p => p.arrival));
      const initQueue = procs
        .filter(p => p.arrival <= initTime)
        .sort((a, b) => a.arrival - b.arrival)
        .map(p => p.name);
      initQueue.forEach(n => added.add(n));
      setRrRemaining(rem);
      setRrQueue(initQueue);
      setRrAdded(added);
      setCurrentTime(initTime);
    } else {
      setRrRemaining({});
      setRrQueue([]);
      setRrAdded(new Set());
      setCurrentTime(0);
    }

    setScreen('play');
  }

  function getCorrectAnswer(time: number, done: string[]): string | null {
    if (algorithm === 'rr') return rrQueue[0] ?? null;
    return getNextCpuProcess(algorithm, playProcesses, done, time, quantum);
  }

  // Mirrors computeCpuGantt's queue advancement: deduct quantum, re-queue partial, admit arrivals, handle idle.
  function advanceRrState(name: string, time: number): {
    nextTime: number;
    newRemaining: Record<string, number>;
    newQueue: string[];
    newAdded: Set<string>;
    newDone: string[];
    allDone: boolean;
  } {
    const rem = rrRemaining[name];
    const runTime = Math.min(quantum, rem);
    const newRem = rem - runTime;
    let nextTime = time + runTime;

    const newRemaining = { ...rrRemaining, [name]: newRem };
    const newAdded = new Set(rrAdded);

    // Remove the head process, then admit newly arrived processes (arrival order), then re-queue if partial
    let newQueue = rrQueue.slice(1);
    playProcesses
      .filter(p => p.arrival > time && p.arrival <= nextTime && !newAdded.has(p.name))
      .sort((a, b) => a.arrival - b.arrival)
      .forEach(p => { newQueue.push(p.name); newAdded.add(p.name); });
    if (newRem > 0) newQueue.push(name);

    // Auto-advance past idle time when queue empties but unadmitted processes remain
    if (newQueue.length === 0) {
      const notYetArrived = playProcesses.filter(p => !newAdded.has(p.name) && newRemaining[p.name] > 0);
      if (notYetArrived.length > 0) {
        nextTime = Math.min(...notYetArrived.map(p => p.arrival));
        notYetArrived
          .filter(p => p.arrival <= nextTime)
          .sort((a, b) => a.arrival - b.arrival)
          .forEach(p => { newQueue.push(p.name); newAdded.add(p.name); });
      }
    }

    const newDone = playProcesses.filter(p => newRemaining[p.name] === 0).map(p => p.name);
    const allDone = Object.values(newRemaining).every(r => r === 0);
    return { nextTime, newRemaining, newQueue, newAdded, newDone, allDone };
  }

  function handleProcessClick(name: string, time: number, done: string[]) {
    const correct = getCorrectAnswer(time, done);
    if (!correct) return;

    setTimerRunning(false);

    if (name === correct) {
      setFlashRight(name);
      setTimeout(() => setFlashRight(null), 500);
      setScore(s => s + 10);

      if (algorithm === 'rr') {
        const runTime = Math.min(quantum, rrRemaining[name]);
        const { nextTime, newRemaining, newQueue, newAdded, newDone, allDone } = advanceRrState(name, time);
        setRrRemaining(newRemaining);
        setRrQueue(newQueue);
        setRrAdded(newAdded);
        setCurrentTime(nextTime);
        setCompletedNames(newDone);
        setPlayMessage(`✓ Correct! ${name} runs for ${runTime} unit(s) under Round Robin.`);
        if (allDone) {
          setPlayDone(true);
          setTimerRunning(false);
          setPlayMessage('All processes scheduled! Run complete.');
          savePlaySession(score + 10, hearts);
        } else {
          setTimeout(() => { setTimerKey(k => k + 1); setTimerRunning(true); setPlayMessage('Click the process that should run next!'); }, 700);
        }
      } else {
        const p = playProcesses.find(x => x.name === name)!;
        const nextTime = time + p.burst;
        const nextDone = [...done, name];
        setCompletedNames(nextDone);
        setCurrentTime(nextTime);
        setPlayMessage(`✓ Correct! ${name} runs next under ${getCpuAlgoLabel(algorithm)}.`);
        if (nextDone.length >= playProcesses.length) {
          setPlayDone(true);
          setTimerRunning(false);
          setPlayMessage('All processes scheduled! Run complete.');
          savePlaySession(score + 10, hearts);
        } else {
          // Auto-advance currentTime past idle gap if no process has arrived yet
          const arrivedNow = playProcesses.filter(p => !nextDone.includes(p.name) && p.arrival <= nextTime);
          if (arrivedNow.length === 0) {
            const nextArrival = Math.min(...playProcesses.filter(p => !nextDone.includes(p.name)).map(p => p.arrival));
            setCurrentTime(nextArrival);
          }
          setTimeout(() => { setTimerKey(k => k + 1); setTimerRunning(true); setPlayMessage('Click the process that should run next!'); }, 700);
        }
      }
    } else {
      setFlashWrong(name);
      setTimeout(() => setFlashWrong(null), 500);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setScore(s => Math.max(0, s - 5));
      setPlayMessage(`✗ Wrong! -1 heart. Follow the ${getCpuAlgoLabel(algorithm)} rule.`);
      if (newHearts <= 0) {
        setPlayDone(true);
        setTimerRunning(false);
        setPlayMessage('GAME OVER! No hearts remaining.');
        savePlaySession(Math.max(0, score - 5), 0);
      } else {
        setTimeout(() => { setTimerKey(k => k + 1); setTimerRunning(true); }, 700);
      }
    }
  }

  function handleTimeout(time: number, done: string[]) {
    const newHearts = hearts - 1;
    setHearts(newHearts);
    setScore(s => Math.max(0, s - 5));

    if (algorithm === 'rr') {
      const head = rrQueue[0];
      if (head) {
        const { nextTime, newRemaining, newQueue, newAdded, newDone, allDone } = advanceRrState(head, time);
        setRrRemaining(newRemaining);
        setRrQueue(newQueue);
        setRrAdded(newAdded);
        setCurrentTime(nextTime);
        setCompletedNames(newDone);
        setPlayMessage(`TIME OUT! ${head} was skipped. -1 heart.`);
        if (allDone || newHearts <= 0) {
          setPlayDone(true);
          setPlayMessage(allDone ? 'All processes scheduled! Run complete.' : 'GAME OVER! No hearts remaining.');
          savePlaySession(Math.max(0, score - 5), newHearts <= 0 ? 0 : newHearts);
          return;
        }
      }
      setTimeout(() => { setTimerKey(k => k + 1); setTimerRunning(true); }, 800);
      return;
    }

    // Non-RR timeout: auto-advance the correct non-preemptive process
    const arrived = playProcesses.filter(p => !done.includes(p.name) && p.arrival <= time);
    if (arrived.length > 0) {
      const correct = getCorrectAnswer(time, done) ?? arrived[0].name;
      const p = playProcesses.find(x => x.name === correct)!;
      const nextDone = [...done, correct];
      const nextTime = time + p.burst;
      setCompletedNames(nextDone);
      setCurrentTime(nextTime);
      setPlayMessage(`TIME OUT! ${correct} was skipped. -1 heart.`);
    }
    if (newHearts <= 0) {
      setPlayDone(true);
      setPlayMessage('GAME OVER! No hearts remaining.');
      savePlaySession(Math.max(0, score - 5), 0);
    } else {
      setTimeout(() => { setTimerKey(k => k + 1); setTimerRunning(true); }, 800);
    }
  }

  async function savePlaySession(finalScore: number, finalHearts: number) {
    try {
      await fetch('/api/cpu/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, score: finalScore, hearts: finalHearts, quantum }),
      });
    } catch { /* silent */ }
  }

  /* ── RENDER ───────────────────────────────────────────────── */
  if (screen === 'modeSelect') {
    return <ModeSelect onBack={() => router.push('/?topic=true')} onSelectMode={(m) => { setMode(m); setScreen(m === 'play' ? 'stageSelect' : 'algoSelect'); }} />;
  }

  if (screen === 'stageSelect') {
    return (
      <DifficultySelect
        title="CPU SCHEDULING"
        descriptions={{
          easy:   '3 processes · 8s timer',
          normal: '5 processes · 5s timer',
          hard:   '7 processes · 3s timer',
        }}
        onSelect={(d) => { setStage(d); setScreen('algoSelect'); }}
        onBack={() => setScreen('modeSelect')}
      />
    );
  }

  if (screen === 'algoSelect') {
    return (
      <AlgoSelect
        mode={mode}
        customProcesses={customProcesses}
        setCustomProcesses={setCustomProcesses}
        quantum={quantum}
        setQuantum={setQuantum}
        useCustom={useCustom}
        setUseCustom={setUseCustom}
        onBack={() => setScreen(mode === 'play' ? 'stageSelect' : 'modeSelect')}
        onSelect={(algo) => mode === 'simulation' ? startSimulation(algo) : startPlay(algo)}
      />
    );
  }

  if (screen === 'simulation') {
    const procs = activeProcesses();
    return (
      <SimulationScreen
        algorithm={algorithm}
        gantt={gantt}
        revealed={revealed}
        stats={stats}
        simMessage={simMessage}
        algoInfo={algoInfo}
        breakdown={breakdown}
        autoRunning={autoRunning}
        processes={procs}
        quantum={quantum}
        onStep={() => simStep(gantt, revealed)}
        onToggleAuto={toggleAuto}
        onRestart={() => startSimulation(algorithm)}
        onExit={() => router.push('/?topic=true')}
      />
    );
  }

  if (screen === 'play') {
    const arrivedUndone = playProcesses.filter(
      p => !completedNames.includes(p.name) && p.arrival <= currentTime
    );
    const correct = getCorrectAnswer(currentTime, completedNames);

    return (
      <PlayScreen
        algorithm={algorithm}
        processes={playProcesses}
        arrivedProcesses={arrivedUndone}
        completedNames={completedNames}
        currentTime={currentTime}
        hearts={hearts}
        score={score}
        playMessage={playMessage}
        playDone={playDone}
        timerKey={timerKey}
        timerRunning={timerRunning && !playDone}
        correctAnswer={correct}
        flashRight={flashRight}
        flashWrong={flashWrong}
        rrRemaining={algorithm === 'rr' ? rrRemaining : undefined}
        rrQueue={algorithm === 'rr' ? rrQueue : undefined}
        timerSeconds={TIMER_BY_DIFFICULTY[stage]}
        onProcessClick={(name) => handleProcessClick(name, currentTime, completedNames)}
        onTimeout={() => handleTimeout(currentTime, completedNames)}
        onRestart={() => startPlay(algorithm)}
        onExit={() => router.push('/?topic=true')}
      />
    );
  }

  return null;
}

/* ─────────────────── SUB-COMPONENTS ────────────────────────── */

function ModeSelect({ onBack, onSelectMode }: { onBack: () => void; onSelectMode: (m: 'play' | 'simulation') => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(18px,3vw,32px)', marginBottom: 32 }}>
          CPU SCHEDULING
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
          <button id="cpuPlayMode" className="topic-card cyan-card" onClick={() => onSelectMode('play')}>
            <span className="topic-icon">▶</span>
            <strong className="topic-title">PLAY</strong>
            <small className="topic-desc">Timed challenge — click the correct next process</small>
          </button>
          <button id="cpuSimMode" className="topic-card pink-card" onClick={() => onSelectMode('simulation')}>
            <span className="topic-icon">⚙</span>
            <strong className="topic-title">SIMULATION</strong>
            <small className="topic-desc">Step-by-step Gantt chart visualiser</small>
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-sm" onClick={onBack}>← BACK</button>
        </div>
      </div>
    </div>
  );
}

function AlgoSelect({
  mode, customProcesses, setCustomProcesses, quantum, setQuantum, useCustom, setUseCustom, onBack, onSelect,
}: {
  mode: 'play' | 'simulation';
  customProcesses: CpuProcess[];
  setCustomProcesses: (p: CpuProcess[]) => void;
  quantum: number;
  setQuantum: (q: number) => void;
  useCustom: boolean;
  setUseCustom: (v: boolean) => void;
  onBack: () => void;
  onSelect: (a: CpuAlgorithm) => void;
}) {
  const algos: { id: CpuAlgorithm; label: string; desc: string }[] = [
    { id: 'fcfs', label: 'FCFS', desc: 'First Come First Served — runs in arrival order.' },
    { id: 'sjf', label: 'SJF', desc: 'Shortest Job First — shortest burst runs next.' },
    { id: 'priority', label: 'PRIORITY', desc: 'Lowest priority number runs next.' },
    { id: 'rr', label: 'ROUND ROBIN', desc: 'Each process gets a fixed time quantum.' },
  ];

  function updateProcess(idx: number, field: keyof CpuProcess, value: string) {
    const updated = customProcesses.map((p, i) => i === idx ? { ...p, [field]: field === 'name' ? value : Number(value) } : p);
    setCustomProcesses(updated);
  }

  function addProcess() {
    if (customProcesses.length >= 8) return;
    setCustomProcesses([...customProcesses, { name: `P${customProcesses.length + 1}`, arrival: 0, burst: 4, priority: customProcesses.length + 1 }]);
  }

  function removeProcess(idx: number) {
    if (customProcesses.length <= 2) return;
    setCustomProcesses(customProcesses.filter((_, i) => i !== idx));
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(12px,2vw,24px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(16px,2.5vw,28px)', marginBottom: 8 }}>
          CPU SCHEDULING
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--cyan)', marginBottom: 24 }}>
          {mode === 'play' ? 'Choose an algorithm to challenge yourself.' : 'Choose an algorithm to simulate.'}
        </p>

        {/* Custom Input Form */}
        <details className="input-form-wrapper" style={{ marginBottom: 20 }}>
          <summary>CUSTOM PROCESS INPUT (optional override)</summary>
          <div style={{ marginTop: 14 }}>
            <div className="form-field">
              <label htmlFor="useCustomToggle">
                Use custom process data instead of defaults
              </label>
              <JustifiedText className="helper-text">
                When enabled, the simulation and play mode will use the process data you enter below instead of the default five-process dataset. Each process requires a unique name, an arrival time (when it enters the ready queue), a burst time (CPU duration in units), and a priority value (lower number means higher urgency in Priority Scheduling).
              </JustifiedText>
              <input
                id="useCustomToggle"
                type="checkbox"
                checked={useCustom}
                onChange={e => setUseCustom(e.target.checked)}
                style={{ marginTop: 8 }}
              />
              <span style={{ marginLeft: 8, color: 'var(--cyan)', fontSize: 12 }}>
                {useCustom ? 'CUSTOM DATA ACTIVE' : 'USING DEFAULTS'}
              </span>
            </div>

            {useCustom && (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {['Process', 'Arrival', 'Burst', 'Priority', ''].map(h => (
                          <th key={h} style={{ border: '1px solid var(--border)', padding: '6px 8px', color: 'var(--yellow)', background: 'var(--panel-mid)', textAlign: 'center' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customProcesses.map((p, i) => (
                        <tr key={i}>
                          {(['name', 'arrival', 'burst', 'priority'] as const).map(field => (
                            <td key={field} style={{ border: '1px solid var(--border)', padding: 4 }}>
                              <input
                                className="form-input"
                                type={field === 'name' ? 'text' : 'number'}
                                value={p[field]}
                                min={field !== 'name' ? 0 : undefined}
                                onChange={e => updateProcess(i, field, e.target.value)}
                                style={{ width: field === 'name' ? 60 : 70 }}
                              />
                            </td>
                          ))}
                          <td style={{ border: '1px solid var(--border)', padding: 4, textAlign: 'center' }}>
                            <button className="btn btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '4px 8px' }} onClick={() => removeProcess(i)}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={addProcess} disabled={customProcesses.length >= 8}>
                  + ADD PROCESS
                </button>

                <div className="form-field" style={{ marginTop: 16 }}>
                  <label htmlFor="quantumInput">Round Robin Time Quantum (units): {quantum}</label>
                  <JustifiedText className="helper-text">
                    The quantum determines how many CPU time units each process is allowed to execute before being preempted and placed back in the ready queue. This setting only affects the Round Robin algorithm; all other algorithms ignore the quantum value.
                  </JustifiedText>
                  <input
                    id="quantumInput"
                    className="form-input"
                    type="range"
                    min={1} max={6}
                    value={quantum}
                    onChange={e => setQuantum(Number(e.target.value))}
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </div>
              </>
            )}
          </div>
        </details>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
          {algos.map(a => (
            <button key={a.id} id={`cpu-algo-${a.id}`} className="algo-card" onClick={() => onSelect(a.id)}>
              <strong>{a.label}</strong>
              <small>{a.desc}</small>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-sm" onClick={onBack}>← BACK</button>
        </div>
      </div>
    </div>
  );
}

function SimulationScreen({
  algorithm, gantt, revealed, stats, simMessage, algoInfo, breakdown, autoRunning, processes, quantum,
  onStep, onToggleAuto, onRestart, onExit,
}: {
  algorithm: CpuAlgorithm; gantt: GanttBlock[]; revealed: number; stats: CpuStats | null;
  simMessage: string; algoInfo: string; breakdown: BreakdownStep[]; autoRunning: boolean;
  processes: CpuProcess[]; quantum: number;
  onStep: () => void; onToggleAuto: () => void; onRestart: () => void; onExit: () => void;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
      <GameHeader moduleName="CPU SCHEDULING" algorithmLabel={getCpuAlgoLabel(algorithm)} modeLabel="SIMULATION" onExit={onExit} exitButtonId="cpuExitButton" />

      <main className="simulation-layout">
        {/* Center panel */}
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Process table */}
          <div style={{ border: '2px solid var(--border)', padding: 12, background: 'rgba(255,255,255,0.03)' }}>
            <h2 style={{ color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12, fontSize: 14 }}>
              PROCESS TABLE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: 10 }}>
              {processes.map(p => (
                <div key={p.name} className="queue-card">
                  <strong style={{ color: 'var(--pink)', display: 'block', marginBottom: 4 }}>{p.name}</strong>
                  <span style={{ color: 'var(--white)', fontSize: 12, display: 'block' }}>Arrival: {p.arrival}</span>
                  <span style={{ color: 'var(--white)', fontSize: 12, display: 'block' }}>Burst: {p.burst}</span>
                  <span style={{ color: 'var(--white)', fontSize: 12, display: 'block' }}>Priority: {p.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt chart */}
          <div style={{ border: '2px solid var(--border)', padding: 12, background: 'rgba(255,255,255,0.03)' }}>
            <h2 style={{ color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12, fontSize: 14 }}>
              GANTT CHART
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {revealed === 0
                ? <div className="gantt-block"><strong>—</strong><span>No slices yet</span></div>
                : gantt.slice(0, revealed).map((b, i) => (
                    <div key={i} className="gantt-block">
                      <strong>{b.name}</strong>
                      <span>{b.start} → {b.end}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Results + Breakdown */}
          {stats && (
            <div style={{ border: '2px solid var(--border)', padding: 12, background: 'rgba(255,255,255,0.03)' }}>
              <h2 style={{ color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12, fontSize: 14 }}>
                RESULTS
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th>
                      <th>Completion</th><th>Turnaround</th><th>Waiting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.rows.map(r => (
                      <tr key={r.name}>
                        <td>{r.name}</td><td>{r.arrival}</td><td>{r.burst}</td><td>{r.priority}</td>
                        <td>{r.completion}</td><td>{r.turnaround}</td><td>{r.waiting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: 10, color: 'var(--yellow)', fontSize: 13 }}>
                Avg Waiting: <strong>{stats.avgWaiting}</strong> &nbsp;|&nbsp; Avg Turnaround: <strong>{stats.avgTurnaround}</strong>
              </p>
              <MathBreakdownPanel steps={breakdown} />
            </div>
          )}
        </section>

        {/* Control panel */}
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 14 }}>SIM CONTROL</h2>
          <button id="cpuStepButton" className="btn" onClick={onStep} disabled={revealed >= gantt.length}>STEP</button>
          <button id="cpuAutoButton" className={`btn ${autoRunning ? 'btn-yellow' : 'btn-pink'}`} onClick={onToggleAuto} disabled={revealed >= gantt.length}>
            {autoRunning ? 'STOP AUTO' : 'AUTO RUN'}
          </button>
          <button id="cpuRestartButton" className="btn btn-sm" onClick={onRestart}>RESTART</button>

          <div className="rule-box" style={{ marginTop: 8 }}>
            <span>ALGORITHM INFO</span>
            <JustifiedText style={{ fontSize: 12, marginTop: 6 }}>{algoInfo}</JustifiedText>
          </div>

          <div className="message-box" style={{ fontSize: 12 }}>{simMessage}</div>
        </section>
      </main>
    </div>
  );
}

function PlayScreen({
  algorithm, processes, arrivedProcesses, completedNames, currentTime, hearts, score,
  playMessage, playDone, timerKey, timerRunning, correctAnswer, flashRight, flashWrong,
  rrRemaining, rrQueue, timerSeconds,
  onProcessClick, onTimeout, onRestart, onExit,
}: {
  algorithm: CpuAlgorithm; processes: CpuProcess[]; arrivedProcesses: CpuProcess[];
  completedNames: string[]; currentTime: number; hearts: number; score: number;
  playMessage: string; playDone: boolean; timerKey: number; timerRunning: boolean;
  correctAnswer: string | null; flashRight: string | null; flashWrong: string | null;
  rrRemaining?: Record<string, number>;
  rrQueue?: string[];
  timerSeconds: number;
  onProcessClick: (name: string) => void; onTimeout: () => void;
  onRestart: () => void; onExit: () => void;
}) {
  const ruleText = {
    fcfs: 'Click the process that arrived earliest.',
    sjf: 'Click the process with the shortest burst time.',
    priority: 'Click the process with the lowest priority number.',
    rr: 'Click the next process in the Round Robin queue order.',
  }[algorithm];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: 'clamp(10px,2vw,20px)' }}>
      <GameHeader moduleName="CPU SCHEDULING" algorithmLabel={getCpuAlgoLabel(algorithm)} modeLabel="PLAY MODE" onExit={onExit} exitButtonId="cpuExitPlay" />

      <main className="play-layout">
        {/* Left: status */}
        <section className="panel">
          <h2 style={{ fontSize: 14 }}>SYSTEM</h2>
          <div className="stat-block">
            <span>HEARTS</span>
            <HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} />
          </div>
          <div className="stat-block">
            <span>SCORE</span>
            <strong>{score}</strong>
          </div>
          <div className="stat-block">
            <span>TIME</span>
            <strong>{currentTime}</strong>
          </div>
          <div className="stat-block">
            <span>SCHEDULED</span>
            <strong>{completedNames.length}/{processes.length}</strong>
          </div>
        </section>

        {/* Center: timer + process cards */}
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!playDone && (
            <TimerBar key={timerKey} seconds={timerSeconds} running={timerRunning} onExpire={onTimeout} />
          )}

          <div style={{ border: '2px solid var(--border)', padding: 12, background: 'rgba(255,255,255,0.03)' }}>
            <h2 style={{ color: 'var(--cyan)', borderBottom: '2px solid var(--pink)', paddingBottom: 8, marginBottom: 12, fontSize: 14 }}>
              ALL PROCESSES
            </h2>

            {/* RR queue order display */}
            {rrQueue && rrQueue.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '5px 10px', marginBottom: 10, fontSize: 11 }}>
                <span style={{ color: 'var(--yellow)' }}>QUEUE: </span>
                {rrQueue.map((n, i) => (
                  <span key={i} style={{ color: i === 0 ? 'var(--cyan)' : 'var(--white)', marginRight: 8, fontFamily: 'var(--font-mono)' }}>
                    {i === 0 ? `► ${n}` : n}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: 10 }}>
              {processes.map(p => {
                const isDone = completedNames.includes(p.name);
                const isArrived = p.arrival <= currentTime && !isDone;
                const isCorrect = p.name === flashRight;
                const isWrong = p.name === flashWrong;
                const displayBurst = rrRemaining ? (rrRemaining[p.name] ?? p.burst) : p.burst;

                return (
                  <button
                    key={p.name}
                    id={`cpu-play-${p.name}`}
                    onClick={() => !playDone && isArrived && onProcessClick(p.name)}
                    disabled={playDone || !isArrived}
                    style={{
                      border: isDone
                        ? '2px solid #333'
                        : isCorrect
                        ? '3px solid var(--success)'
                        : isWrong
                        ? '3px solid var(--danger)'
                        : isArrived
                        ? '3px solid var(--cyan)'
                        : '2px solid var(--border)',
                      background: isDone
                        ? '#0a0f1a'
                        : isArrived
                        ? 'rgba(5,217,232,0.1)'
                        : 'var(--terminal-black)',
                      padding: 10,
                      cursor: isArrived && !playDone ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                      opacity: isDone ? 0.4 : p.arrival > currentTime ? 0.6 : 1,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--white)',
                      position: 'relative',
                    }}
                    className={isCorrect ? 'correct-flash' : isWrong ? 'wrong-flash' : ''}
                  >
                    <strong style={{ display: 'block', color: isDone ? '#666' : 'var(--yellow)', fontSize: 16 }}>{p.name}</strong>
                    <span style={{ fontSize: 11, display: 'block' }}>
                      Arr: {p.arrival} | {rrRemaining ? `Rem: ${displayBurst}` : `Burst: ${p.burst}`}
                    </span>
                    <span style={{ fontSize: 11, display: 'block' }}>Pri: {p.priority}</span>
                    {isDone && <span style={{ fontSize: 10, color: 'var(--success)' }}>✓ DONE</span>}
                    {p.arrival > currentTime && <span style={{ fontSize: 10, color: '#7a8ab0' }}>arrives@{p.arrival}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: controls */}
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 14 }}>CONTROL</h2>
          <div className="rule-box">
            <span>RULE</span>
            <JustifiedText style={{ fontSize: 12, marginTop: 4 }}>{ruleText}</JustifiedText>
          </div>
          <div className="message-box" style={{ fontSize: 12 }}>{playMessage}</div>
          {playDone && (
            <>
              <button id="cpuPlayRestart" className="btn" onClick={onRestart}>PLAY AGAIN</button>
              <button id="cpuPlayExit" className="btn btn-sm" onClick={onExit}>← MENU</button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
