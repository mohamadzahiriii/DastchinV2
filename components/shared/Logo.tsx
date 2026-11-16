import { Gem } from 'lucide-react';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';

type LogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
};

export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-saffron-400 text-ink-950 shadow-[0_0_0_1px_rgba(232,185,90,0.4)]">
        <Gem className="h-4.5 w-4.5" strokeWidth={2.2} aria-hidden />
      </span>
      {variant === 'full' && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold text-ink-50">{brand.name}</span>
          <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-ink-400 uppercase">
            {brand.latinName}
          </span>
        </span>
      )}
    </span>
  );
}
