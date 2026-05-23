/**
 * useAuth — Auth state + role awareness
 * Provides: session, user, profile (with role), loading, logout
 */
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../core/supabase/client';
import type { Profile, Role } from '../../core/supabase/types';

interface AuthState {
  session:  Session | null;
  user:     User | null;
  profile:  Profile | null;
  role:     Role | null;
  loading:  boolean;
  logout:   () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession]   = useState<Session | null>(null);
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows returned (new user, no profile yet)
      if (error.code !== 'PGRST116') {
        console.error('[useAuth] fetchProfile error:', error.message, '| code:', error.code);
      }
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial session load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Keep in sync on sign-in / sign-out / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
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
    setProfile(null);
  };

  return {
    session,
    user:    session?.user ?? null,
    profile,
    role:    profile?.role ?? null,
    loading,
    logout,
  };
}
