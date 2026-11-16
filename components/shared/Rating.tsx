import { Star } from 'lucide-react';
import { formatNumber, formatRating } from '@/lib/format';
import { cn } from '@/lib/utils';

type RatingProps = {
  value: number;
  count?: number;
  className?: string;
};

export function Rating({ value, count, className }: RatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-400" aria-hidden />
      <span className="font-semibold text-ink-50 tabular-nums">{formatRating(value)}</span>
      {count !== undefined && (
        <span className="text-ink-400 tabular-nums">({formatNumber(count)} نظر)</span>
      )}
    </span>
  );
}
