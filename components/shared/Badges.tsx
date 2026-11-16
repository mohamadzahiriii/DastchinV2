import { cn } from '@/lib/utils';
import { formatNumber, formatPercent } from '@/lib/format';

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  if (percent <= 0) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-saffron-400 px-2 py-0.5 text-xs font-bold text-ink-950 tabular-nums',
        className,
      )}
    >
      {formatPercent(percent)} تخفیف
    </span>
  );
}

export function AvailabilityLabel({ remaining, className }: { remaining: number; className?: string }) {
  const limited = remaining <= 3;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        limited ? 'text-coral-300' : 'text-sage-300',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', limited ? 'bg-coral-400' : 'bg-sage-400')} aria-hidden />
      {limited ? `فقط ${formatNumber(remaining)} عدد مانده` : 'موجود برای امروز'}
    </span>
  );
}
