'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useSupabase } from '@/lib/auth/use-supabase';

export function useFavoritesSupabase() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabase();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIds([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (!cancelled && !error) {
        setIds((data ?? []).map((r) => r.product_id));
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user, authLoading, supabase]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return;
      const isFav = ids.includes(productId);

      setIds((prev) => (isFav ? prev.filter((x) => x !== productId) : [...prev, productId]));

      if (isFav) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          product_id: productId,
        });
      }
    },
    [user, ids, supabase],
  );

  return {
    ids,
    loading,
    isFavorite: (id: string) => ids.includes(id),
    toggle,
  };
}
