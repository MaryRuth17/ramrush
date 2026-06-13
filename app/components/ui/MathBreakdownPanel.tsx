'use client';

// components/ui/MathBreakdownPanel.tsx — Step-by-step math breakdown panel

import type { BreakdownStep } from '@/lib/cpu/breakdown';

interface MathBreakdownPanelProps {
  steps: BreakdownStep[];
  title?: string;
}

export function MathBreakdownPanel({ steps, title = 'STEP-BY-STEP MATHEMATICAL BREAKDOWN' }: MathBreakdownPanelProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <details className="breakdown-panel" open={false}>
      <summary>{title}</summary>
      <div style={{ marginTop: 12 }}>
        {steps.map((s) => (
          <div key={s.step} className="breakdown-step">
            <div className="step-title">Step {s.step}: {s.title}</div>
            <div className="step-explanation">{s.explanation}</div>
            {s.formula && (
              <div className="step-formula">{s.formula}</div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
