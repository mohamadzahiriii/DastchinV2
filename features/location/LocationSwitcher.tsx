'use client';

import { useState } from 'react';
import { MapPin, ChevronLeft } from 'lucide-react';
import { useLocation } from '@/lib/location/location-context';
import { LocationSelector } from './LocationSelector';
import { cn } from '@/lib/utils';

export function LocationSwitcher({ className }: { className?: string }) {
  const { location, loading } = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className={cn('flex h-9 items-center gap-2 rounded-full px-3 text-xs text-ink-500', className)}>
        <MapPin className="h-3.5 w-3.5 animate-pulse" aria-hidden />
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border border-ink-700 px-3 text-xs font-medium text-ink-200 transition-all hover:border-saffron-400/40 hover:text-saffron-300 active:scale-95',
          !location && 'border-saffron-400/30 text-saffron-300',
          className,
        )}
        aria-label={location ? `محدوده شما: ${location.neighborhood}` : 'انتخاب محدوده'}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {location ? (
          <span className="flex items-center gap-1">
            <span className="text-ink-400">محدوده شما:</span>
            <span className="font-semibold">{location.neighborhood}</span>
            <ChevronLeft className="h-3 w-3 text-ink-500" aria-hidden />
          </span>
        ) : (
          <span>انتخاب محدوده</span>
        )}
      </button>
      <LocationSelector open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function FirstTimeLocationPrompt() {
  const { needsPrompt, loading } = useLocation();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (loading || !needsPrompt || dismissed) return null;

  return (
    <>
      <div className="border-b border-saffron-400/20 bg-saffron-400/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-saffron-300" aria-hidden />
            <p className="text-sm text-ink-200">
              برای دیدن فروشگاه‌های نزدیک شما، محدوده خود را انتخاب کنید.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full bg-saffron-400 px-4 text-xs font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95"
            >
              انتخاب محدوده
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex h-9 items-center rounded-full px-3 text-xs text-ink-400 transition-colors hover:text-ink-200"
            >
              بعداً
            </button>
          </div>
        </div>
      </div>
      <LocationSelector open={open} onClose={() => setOpen(false)} />
    </>
  );
}
