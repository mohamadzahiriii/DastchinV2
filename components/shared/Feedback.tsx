import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex flex-col gap-2">
        {eyebrow && <span className="text-xs font-medium tracking-wide text-saffron-300">{eyebrow}</span>}
        <h2 className="text-2xl font-bold text-ink-50 md:text-3xl">{title}</h2>
        {description && <p className="max-w-xl text-sm leading-relaxed text-ink-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-700 bg-ink-900/50 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-ink-300">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </span>
      <h3 className="text-base font-semibold text-ink-50">{title}</h3>
      {description && <p className="max-w-sm text-sm leading-relaxed text-ink-300">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-ink-800" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-1/3 bg-ink-800" />
        <Skeleton className="h-5 w-4/5 bg-ink-800" />
        <Skeleton className="mt-3 h-4 w-1/2 bg-ink-800" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
