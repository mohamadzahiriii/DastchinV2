'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  size?: 'md' | 'lg';
  action?: string;
  onSearch?: (value: string) => void;
};

export function SearchBar({
  defaultValue = '',
  placeholder = 'جستجوی نان، کیک، فروشگاه یا غذا...',
  className,
  size = 'md',
  action = '/explore',
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (onSearch) {
      onSearch(query);
      return;
    }
    router.push(query ? `${action}?q=${encodeURIComponent(query)}` : action);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        'group flex w-full items-center gap-2 rounded-full border border-ink-700 bg-ink-900/80 transition-colors focus-within:border-saffron-400/60',
        size === 'lg' ? 'h-14 ps-5 pe-2' : 'h-11 ps-4 pe-1.5',
        className,
      )}
    >
      <Search className={cn('shrink-0 text-ink-400 transition-colors group-focus-within:text-saffron-300', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="جستجو"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-ink-50 placeholder:text-ink-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden',
          size === 'lg' ? 'text-base' : 'text-sm',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="پاک کردن جستجو"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:text-ink-50"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          'shrink-0 rounded-full bg-saffron-400 font-semibold text-ink-950 transition-all hover:bg-saffron-300 active:scale-95',
          size === 'lg' ? 'h-10 px-5 text-sm' : 'h-8 px-4 text-xs',
        )}
      >
        جستجو
      </button>
    </form>
  );
}
