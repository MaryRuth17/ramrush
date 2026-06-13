'use client';

// components/ui/HeartDisplay.tsx — Heart life display

interface HeartDisplayProps {
  hearts: number;
  maxHearts: number;
}

export function HeartDisplay({ hearts, maxHearts }: HeartDisplayProps) {
  return (
    <div style={{ fontSize: 22, letterSpacing: 4 }}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <span key={i} className={i < hearts ? 'heart-full' : 'heart-empty'}>
          ♥
        </span>
      ))}
    </div>
  );
}
