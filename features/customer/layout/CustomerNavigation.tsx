'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, UserRound, LogIn } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { SearchBar } from '@/components/shared/SearchBar';
import { LocationSwitcher } from '@/features/location/LocationSwitcher';
import { customerNav, customerBottomNav } from '@/config/navigation';
import { isNavActive } from '@/lib/nav';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

export function CustomerHeader() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
        <Link href="/" aria-label="صفحه اصلی" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="منوی اصلی" className="hidden items-center gap-1 lg:flex">
          {customerNav.map((item) => {
            const active = isNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm transition-colors',
                  active ? 'bg-ink-800 text-ink-50' : 'text-ink-300 hover:text-ink-50',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <LocationSwitcher />
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar className="max-w-md" />
        </div>

        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <IconLink href="/favorites" label="علاقه‌مندی‌ها" icon={Heart} active={pathname === '/favorites'} />
          <IconLink href="/cart" label="سبد خرید" icon={ShoppingBag} active={pathname === '/cart'} />
          {loading ? null : isAuthenticated ? (
            <IconLink href="/profile" label="حساب کاربری" icon={UserRound} active={pathname === '/profile'} className="hidden md:flex" />
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-full bg-saffron-400/15 px-4 text-sm font-medium text-saffron-300 transition-colors hover:bg-saffron-400/25"
            >
              <LogIn className="h-4 w-4" />
              ورود
            </Link>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <div className="mb-2">
          <LocationSwitcher />
        </div>
        <SearchBar />
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  icon: Icon,
  active,
  className,
}: {
  href: string;
  label: string;
  icon: typeof Heart;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full text-ink-200 transition-colors hover:bg-ink-800 hover:text-saffron-300',
        active && 'text-saffron-300',
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </Link>
  );
}

export function CustomerBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="منوی پایین صفحه"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {customerBottomNav.map((item) => {
          const active = isNavActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors',
                  active ? 'text-saffron-300' : 'text-ink-400 hover:text-ink-100',
                )}
              >
                <span className={cn('flex h-7 w-12 items-center justify-center rounded-full transition-colors', active && 'bg-saffron-400/15')}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
