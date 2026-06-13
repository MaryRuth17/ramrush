'use client';

// components/ui/TimerBar.tsx — Reusable countdown timer

import { useEffect, useRef, useState, useCallback } from 'react';

interface TimerBarProps {
  seconds: number;
  running: boolean;
  onExpire: () => void;
  onTick?: (remaining: number) => void;
}

export function TimerBar({ seconds, running, onExpire, onTick }: TimerBarProps) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) { stop(); return; }

    expiredRef.current = false;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        const next = Math.max(0, prev - 0.1);
        onTick?.(next);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          stop();
          // Defer to avoid calling setState during render
          setTimeout(() => onExpire(), 0);
        }
        return next;
      });
    }, 100);

    return stop;
  }, [running, onExpire, onTick, stop]);

  const pct = Math.max(0, (remaining / seconds) * 100);
  const barColor = pct <= 30 ? 'var(--danger)' : pct <= 60 ? 'var(--yellow)' : 'var(--success)';
  const display = Math.max(0, Math.ceil(remaining));

  return (
    <div className="rule-box" style={{ marginBottom: 0 }}>
      <span>TIME TO DECIDE</span>
      <strong style={{ display: 'block', color: 'var(--pink)', fontSize: 'clamp(26px,4vw,42px)', textAlign: 'center' }}>
        {display}
      </strong>
      <div className="timer-bar-shell">
        <div className="timer-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}
