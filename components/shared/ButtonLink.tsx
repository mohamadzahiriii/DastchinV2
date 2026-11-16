import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all active:scale-95',
        variant === 'primary' && 'bg-saffron-400 text-ink-950 hover:bg-saffron-300',
        variant === 'outline' && 'border border-ink-600 text-ink-50 hover:border-ink-400 hover:bg-ink-900',
        className,
      )}
    >
      {children}
    </Link>
  );
}
