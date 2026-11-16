'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFavoritesSupabase } from '@/hooks/use-favorites-supabase';
import { cn } from '@/lib/utils';

type FavoriteButtonProps = {
  id: string;
  label: string;
  className?: string;
};

export function FavoriteButton({ id, label, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const localFavs = useFavorites();
  const supabaseFavs = useFavoritesSupabase();

  const { isFavorite, toggle } = isAuthenticated
    ? supabaseFavs
    : { isFavorite: localFavs.isFavorite, toggle: localFavs.toggle };

  const active = isFavorite(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `حذف ${label} از علاقه‌مندی‌ها` : `افزودن ${label} به علاقه‌مندی‌ها`}
      onClick={() => {
        toggle(id);
        toast(active ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
      }}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border border-ink-700/60 bg-ink-950/70 text-ink-100 backdrop-blur transition-all duration-200 hover:scale-105 hover:border-saffron-400/60 hover:text-saffron-300 active:scale-95',
        active && 'border-saffron-400/60 text-saffron-300',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4 transition-colors', active && 'fill-saffron-400')} aria-hidden />
    </button>
  );
}
