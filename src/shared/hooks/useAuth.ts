/**
 * useAuth.ts
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../core/supabase/client";
import type { Role } from "../../core/supabase/types";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: cached },
      } = await supabase.auth.getSession();
      if (!mounted) return;

      if (cached) {
        setSession(cached);

        const { data: refreshed } = await supabase.auth.refreshSession();
        if (mounted) setSession(refreshed.session ?? cached);
      }
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (!session) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const role = (session?.user?.user_metadata?.role as Role) ?? null;

  return {
    session,
    user: session?.user ?? null,
    role,
    loading,
    logout,
  };
}
