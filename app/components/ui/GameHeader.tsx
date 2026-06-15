'use client';

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
      <div>
        <h1>{moduleName}</h1>
        <p>{algorithmLabel} — {modeLabel}</p>
      </div>
      <button id={exitButtonId} className="btn btn-sm" onClick={onExit}>EXIT</button>
    </header>
  );
}
