'use client';

// components/ui/DifficultySelect.tsx — Reusable Easy/Normal/Hard difficulty picker

import { TIMER_BY_DIFFICULTY } from '@/lib/game/constants';

type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultySelectProps {
  title: string;
  onSelect: (d: Difficulty) => void;
  onBack: () => void;
  descriptions?: { easy: string; normal: string; hard: string };
}

const OPTIONS: { id: Difficulty; label: string; color: string }[] = [
  { id: 'easy',   label: 'EASY',   color: 'var(--success)' },
  { id: 'normal', label: 'NORMAL', color: 'var(--cyan)'    },
  { id: 'hard',   label: 'HARD',   color: 'var(--danger)'  },
];

const DEFAULT_DESCRIPTIONS = {
  easy:   `${TIMER_BY_DIFFICULTY.easy}s per question`,
  normal: `${TIMER_BY_DIFFICULTY.normal}s per question`,
  hard:   `${TIMER_BY_DIFFICULTY.hard}s per question`,
};

export function DifficultySelect({ title, onSelect, onBack, descriptions }: DifficultySelectProps) {
  const descs = descriptions ?? DEFAULT_DESCRIPTIONS;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 700, width: '100%', padding: 24 }}>
        <h1 className="font-pixel" style={{ color: 'var(--yellow)', textAlign: 'center', fontSize: 'clamp(16px,2.5vw,28px)', marginBottom: 12 }}>
          {title}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--cyan)', marginBottom: 32, fontSize: 14 }}>SELECT DIFFICULTY</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 24 }}>
          {OPTIONS.map(o => (
            <button
              key={o.id}
              id={`difficulty-${o.id}`}
              className="algo-card"
              style={{ borderColor: o.color }}
              onClick={() => onSelect(o.id)}
            >
              <strong style={{ color: o.color }}>{o.label}</strong>
              <small>{descs[o.id]}</small>
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
