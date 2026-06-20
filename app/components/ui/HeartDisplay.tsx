'use client';

// components/ui/HeartDisplay.tsx — Heart life display with pixel art heart images

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: hearts }, (_, i) => (
        <Image
          key={i}
          src="/ui/full_heart.png"
          alt="heart"
          width={28}
          height={28}
          className="heart-full"
          style={{ imageRendering: 'pixelated' }}
        />
      ))}
      {animatingOut && (
        <Image
          src="/ui/full_heart.png"
          alt="losing heart"
          width={28}
          height={28}
          className="heart-losing"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      {Array.from({ length: Math.max(0, emptyCount) }, (_, i) => (
        <Image
          key={`e${i}`}
          src="/ui/empty_heart.png"
          alt="empty heart"
          width={28}
          height={28}
          className="heart-empty"
          style={{ imageRendering: 'pixelated' }}
        />
      ))}
    </div>
  );
}
