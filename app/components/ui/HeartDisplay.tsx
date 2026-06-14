'use client';

// components/ui/HeartDisplay.tsx — Heart life display with loss animation

import { useEffect, useRef, useState } from 'react';

interface HeartDisplayProps {
  hearts: number;
  maxHearts: number;
}

export function HeartDisplay({ hearts, maxHearts }: HeartDisplayProps) {
  const prevHearts = useRef(hearts);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (hearts < prevHearts.current) {
      setAnimatingOut(true);
      const t = setTimeout(() => setAnimatingOut(false), 600);
      prevHearts.current = hearts;
      return () => clearTimeout(t);
    }
    prevHearts.current = hearts;
  }, [hearts]);

  const emptyCount = maxHearts - hearts - (animatingOut ? 1 : 0);

  return (
    <div style={{ fontSize: 30, letterSpacing: 4 }}>
      {Array.from({ length: hearts }, (_, i) => (
        <span key={i} className="heart-full">♥</span>
      ))}
      {animatingOut && <span className="heart-losing">♥</span>}
      {Array.from({ length: Math.max(0, emptyCount) }, (_, i) => (
        <span key={`e${i}`} className="heart-empty">♡</span>
      ))}
    </div>
  );
}
