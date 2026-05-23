/**
 * useAuth — reads role directly from session user_metadata
 *
 * Role is stored in auth.users.raw_user_meta_data by the super admin via SQL:
 *   UPDATE auth.users
 *   SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data,'{}'), '{role}', '"super_admin"')
 *   WHERE email = 'someone@example.com';
 *
 * The session is refreshed on mount so that role changes take effect
 * without requiring a full sign-out / sign-in cycle.
 */
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../core/supabase/client';
import type { Role } from '../../core/supabase/types';

interface AuthState {
  session: Session | null;
  user:    User | null;
  role:    Role | null;
  loading: boolean;
  logout:  () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // 1. Get current cached session first (fast)
      const { data: { session: cached } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (cached) {
        setSession(cached);
        // 2. Force-refresh so user_metadata reflects any SQL changes made after login
        const { data: refreshed } = await supabase.auth.refreshSession();
        if (mounted) setSession(refreshed.session ?? cached);
      }
      setLoading(false);
    };

    init();

    // Keep in sync on token refresh / sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setSession(session);
        if (!session) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Role is embedded in the JWT — no table query, no 403 errors
  const role = (session?.user?.user_metadata?.role as Role) ?? null;

  return {
    session,
    user:    session?.user ?? null,
    role,
    loading,
    logout,
  };
}
