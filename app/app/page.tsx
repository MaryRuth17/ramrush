'use client';

// app/page.tsx — Opening screen + Topic Select (client component)

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


type Screen = 'opening' | 'topic';

const BOOT_LINES = [
  '> SYSTEM BOOTING...',
  '> MEMORY GRID ONLINE',
  '> ALLOCATION MODULE READY',
  '> CPU SCHEDULER ACTIVE',
  '> VM PAGE TABLE LOADED',
  '> DISK CONTROLLER READY',
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<Screen>(searchParams.get('topic') === 'true' ? 'topic' : 'opening');
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('topic') === 'true') {
      setScreen('topic');
    }
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #111a35, #050816 65%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(10px, 2vw, 20px)',
      }}
    >
      <div style={{ margin: 'auto 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {screen === 'opening' ? (
          <OpeningScreen onStart={() => setScreen('topic')} />
        ) : (
          <TopicSelectScreen
            onBack={() => setScreen('opening')}
            onSelectTopic={(topic) => router.push(`/${topic}`)}
          />
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050816' }}></div>}>
      <HomeContent />
    </Suspense>
  );
}

/* ── OPENING SCREEN ──────────────────────────────────────────────────── */
function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="opening-screen-wrapper">
      {/* Pixel-art CRT frame — the start_screen.png drawn asset */}
      <div className="crt-frame">
        <div className="scanline-layer" />

        {/* Boot text */}
        <div className="boot-text" style={{ position: 'relative', zIndex: 2 }}>
          {BOOT_LINES.map((line, i) => (
            <p key={i} className={i === BOOT_LINES.length - 1 ? 'ready-text' : ''}>
              {i === BOOT_LINES.length - 1 ? '> STATUS: READY' : line}
            </p>
          ))}
        </div>

        {/* Logo image replaces the plain text title */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: '28px auto 16px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/icons/logo.png"
            alt="RAM RUSH"
            style={{ imageRendering: 'pixelated', width: '60%', maxWidth: 300, height: 'auto', display: 'block' }}
          />
        </div>
        <p style={{ position: 'relative', zIndex: 2, color: 'var(--yellow)', textAlign: 'center', fontSize: 12, marginBottom: 20 }}>
          OS ALGORITHMS CHALLENGE — v12
        </p>

        {/* Start button */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <button
            id="startButton"
            className="btn btn-lg"
            style={{ minWidth: 200 }}
            onClick={onStart}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TOPIC SELECT SCREEN ────────────────────────────────────────────── */
const TOPICS = [
  {
    id: 'memory',
    icon: '▦',
    title: 'MEMORY ALLOCATION',
    desc: 'First Fit, Best Fit, Worst Fit — Play & Simulation modes',
    cardImg: '/assets/topic_select_blue.png',
  },
  {
    id: 'cpu',
    icon: '⏱',
    title: 'CPU SCHEDULING',
    desc: 'FCFS, SJF, Priority, Round Robin — Play & Simulation modes',
    cardImg: '/assets/topic_select_red.png',
  },
  {
    id: 'vm',
    icon: '▤',
    title: 'VIRTUAL MEMORY',
    desc: 'FIFO, LRU, Optimal page replacement — Play & Simulation modes',
    cardImg: '/assets/topic_select_blue.png',
  },
  {
    id: 'disk',
    icon: '◎',
    title: 'DISK SCHEDULING',
    desc: 'FCFS, SSTF, SCAN, C-SCAN, LOOK — Play & Simulation modes',
    cardImg: '/assets/topic_select_red.png',
  },
];

function TopicSelectScreen({
  onBack,
  onSelectTopic,
}: {
  onBack: () => void;
  onSelectTopic: (topic: string) => void;
}) {
  return (
    <div
      style={{
        maxWidth: 900,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: '20px 0',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-pixel)',
          color: 'var(--yellow)',
          textAlign: 'center',
          fontSize: 'clamp(22px, 4vw, 42px)',
        }}
      >
        SELECT TOPIC
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 18,
        }}
        className="topic-grid"
      >
        {TOPICS.map((t) => (
          <button
            key={t.id}
            id={`topic-${t.id}`}
            className="topic-card-pixel"
            onClick={() => onSelectTopic(t.id)}
            style={{
              backgroundImage: `url('${t.cardImg}')`,
              backgroundSize: '100% 100%',
              imageRendering: 'pixelated',
            }}
          >
            <div className="topic-card-content">
              <span className="topic-icon">{t.icon}</span>
              <strong className="topic-title">{t.title}</strong>
              <small className="topic-desc">{t.desc}</small>
            </div>
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button id="topicBackButton" className="btn btn-sm" onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  );
}
