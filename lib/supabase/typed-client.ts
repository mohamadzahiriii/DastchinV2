'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = SupabaseClient;

let client: TypedSupabaseClient | null = null;

export function getTypedSupabaseClient(): TypedSupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // During static prerendering env vars may not be available.
    // Return a client with placeholder values — it won't be used at runtime.
    client = createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: { persistSession: false },
    });
    return client;
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}