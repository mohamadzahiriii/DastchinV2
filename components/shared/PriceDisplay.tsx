import { formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';

type PriceDisplayProps = {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: { current: 'text-base', original: 'text-xs' },
  md: { current: 'text-lg', original: 'text-sm' },
  lg: { current: 'text-3xl', original: 'text-base' },
};

export function PriceDisplay({ price, originalPrice, size = 'md', className }: PriceDisplayProps) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-bold text-saffron-300 tabular-nums', sizes[size].current)}>
        {formatToman(price)}
      </span>
      {originalPrice !== undefined && originalPrice > price && (
        <span className={cn('text-ink-500 line-through tabular-nums', sizes[size].original)}>
          {formatToman(originalPrice)}
        </span>
      )}
    </div>
  );
}
