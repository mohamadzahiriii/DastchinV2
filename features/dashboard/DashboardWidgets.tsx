import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const tones: Record<Tone, string> = {
  success: 'bg-sage-400/15 text-sage-300',
  warning: 'bg-ember-400/15 text-ember-300',
  danger: 'bg-rose-500/15 text-rose-300',
  neutral: 'bg-ink-700 text-ink-100',
  info: 'bg-teal-500/15 text-teal-300',
};

export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-medium', tones[tone])}>{children}</span>;
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-800 bg-ink-900 p-5">
      <span className="text-xs text-ink-400">{label}</span>
      <span className="text-2xl font-bold text-ink-50 tabular-nums">{value}</span>
      {hint && <span className="text-xs text-ink-300">{hint}</span>}
    </div>
  );
}
