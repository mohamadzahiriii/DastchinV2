'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { adminNav, merchantNav, type NavItem } from '@/config/navigation';
import { isNavActive } from '@/lib/nav';
import { cn } from '@/lib/utils';

export type DashboardVariant = 'merchant' | 'admin';

const variants: Record<DashboardVariant, { title: string; navItems: NavItem[]; badge: string }> = {
  merchant: { title: 'پنل فروشگاه', navItems: merchantNav, badge: 'فروشگاه نمونه' },
  admin: { title: 'پنل مدیریت', navItems: adminNav, badge: 'مدیر نمونه' },
};

export function DashboardShell({ variant, children }: { variant: DashboardVariant; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { title, navItems, badge } = variants[variant];

  const nav = (
    <nav aria-label={title} className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isNavActive(pathname, item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              active ? 'bg-saffron-400/12 text-saffron-200' : 'text-ink-300 hover:bg-ink-800 hover:text-ink-50',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-e border-ink-800 bg-ink-900/60 p-5 lg:flex">
        <Link href={variant === 'admin' ? '/admin' : '/merchant'}>
          <Logo />
        </Link>
        <span className="w-fit rounded-md border border-ink-700 px-2 py-1 text-[11px] text-ink-300">{title}</span>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="بستن منو" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" />
          <div className="absolute inset-y-0 start-0 flex w-72 flex-col gap-6 overflow-y-auto border-e border-ink-800 bg-ink-900 p-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" aria-label="بستن منو" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-300 hover:bg-ink-800">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-800 bg-ink-950/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="باز کردن منو" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full text-ink-200 hover:bg-ink-800 lg:hidden">
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <Link href={variant === 'admin' ? '/admin' : '/merchant'} className="lg:hidden">
              <Logo variant="mark" />
            </Link>
            <span className="hidden text-sm text-ink-300 sm:inline">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-ink-300 transition-colors hover:text-saffron-300 sm:inline">مشاهده سایت مشتری</Link>
            <span className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ink-200">{badge}</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
