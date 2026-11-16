'use client';

import { useMemo } from 'react';
import { getTypedSupabaseClient } from '@/lib/supabase/typed-client';
import type { TypedSupabaseClient } from '@/lib/supabase/typed-client';

export function useSupabase(): TypedSupabaseClient {
  return useMemo(() => getTypedSupabaseClient(), []);
}
