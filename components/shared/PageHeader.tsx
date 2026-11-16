import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 border-b border-ink-800 pb-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-ink-50 md:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-relaxed text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-teal-500/30 bg-teal-900/30 px-4 py-3 text-sm leading-relaxed text-teal-300">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
      <p>{children ?? 'این بخش نمایشی است. داده‌ها نمونه هستند و به سرویس واقعی متصل نیستند.'}</p>
    </div>
  );
}
