'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/auth/use-supabase';
import type { Database } from '@/types/database';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

export function useCategories() {
  const supabase = useSupabase();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setCategories(data ?? []);
      }
      setLoading(false);
    })();
  }, [supabase]);

  return { categories, loading, error };
}
