'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getTypedSupabaseClient } from '@/lib/supabase/typed-client';
import type { UserRole } from '@/types/database';

type AuthState = {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  loading: boolean;
  isAuthenticated: boolean;
  isMerchant: boolean;
  isAdmin: boolean;
};

type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  session: null,
  roles: [],
  loading: true,
  isAuthenticated: false,
  isMerchant: false,
  isAdmin: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getTypedSupabaseClient(), []);
  const [state, setState] = useState<AuthState>(initialState);

  async function loadRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) return [];
    return (data ?? []).map((r) => r.role as UserRole);
  }

  async function refreshRoles() {
    if (!state.user) return;
    const roles = await loadRoles(state.user.id);
    setState((prev) => ({
      ...prev,
      roles,
      isMerchant: roles.includes('merchant'),
      isAdmin: roles.includes('admin'),
    }));
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (session?.user) {
        const roles = await loadRoles(session.user.id);
        if (!mounted) return;
        setState({
          user: session.user,
          session,
          roles,
          loading: false,
          isAuthenticated: true,
          isMerchant: roles.includes('merchant'),
          isAdmin: roles.includes('admin'),
        });
      } else {
        setState({ ...initialState, loading: false });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const roles = await loadRoles(session.user.id);
        if (!mounted) return;
        setState({
          user: session.user,
          session,
          roles,
          loading: false,
          isAuthenticated: true,
          isMerchant: roles.includes('merchant'),
          isAdmin: roles.includes('admin'),
        });
      } else {
        setState({ ...initialState, loading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setState({ ...initialState, loading: false });
  }

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signOut, refreshRoles }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
