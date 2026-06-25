'use client';

import Image from 'next/image';

interface GameHeaderProps {
  moduleName: string;
  algorithmLabel: string;
  modeLabel: string;
  onExit: () => void;
  exitButtonId?: string;
}

export function GameHeader({ moduleName, algorithmLabel, modeLabel, onExit, exitButtonId }: GameHeaderProps) {
  return (
    <header className="game-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Image
          src="/icons/logo.png"
          alt="RAM RUSH logo"
          width={90}
          height={45}
          style={{ imageRendering: 'pixelated', flexShrink: 0 }}
        />
        <div>
          <h1>{moduleName}</h1>
          <p>{algorithmLabel} — {modeLabel}</p>
        </div>
      </div>
      <button id={exitButtonId} className="btn btn-sm" onClick={onExit}>EXIT</button>
    </header>
  );
}
