// components/ui/JustifiedText.tsx — Wrapper enforcing justified text on all explanatory content

import type { ReactNode } from 'react';

import type { CSSProperties } from 'react';

interface JustifiedTextProps {
  children: ReactNode;
  as?: 'p' | 'div' | 'span';
  className?: string;
  style?: CSSProperties;
}

export function JustifiedText({ children, as: Tag = 'p', className = '', style }: JustifiedTextProps) {
  return (
    <Tag className={`text-justified ${className}`} style={style}>
      {children}
    </Tag>
  );
}
