import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAM Rush — OS Algorithms Educational Game',
  description:
    'An interactive educational game covering Memory Allocation, CPU Scheduling, Virtual Memory, and Disk Scheduling algorithms. Practice OS concepts with timed Play Mode challenges and step-by-step simulation breakdowns.',
  keywords: ['operating systems', 'CPU scheduling', 'memory allocation', 'page replacement', 'disk scheduling', 'educational game'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="scanlines" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
