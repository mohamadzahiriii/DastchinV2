'use client';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function DemoActionButton({
  label,
  message,
  variant = 'outline',
}: {
  label: string;
  message: string;
  variant?: 'primary' | 'outline' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={() => toast(message)}
      className={cn(
        'inline-flex h-8 items-center rounded-full px-3 text-xs font-medium transition-all active:scale-95',
        variant === 'primary' && 'bg-saffron-400 font-semibold text-ink-950 hover:bg-saffron-300',
        variant === 'outline' && 'border border-ink-600 text-ink-100 hover:border-ink-400 hover:bg-ink-800',
        variant === 'danger' && 'border border-rose-500/50 text-rose-300 hover:bg-rose-500/10',
      )}
    >
      {label}
    </button>
  );
}
