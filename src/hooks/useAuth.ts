import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { supabase } from '../lib/supabase';

const SESSION_TIMEOUT = 8000;

export function useAuth() {
  const { user, session, loading, setUser, setSession, setLoading, signOut, refreshProfile } = useAuthStore();
  const { setTheme } = useUIStore();

  useEffect(() => {
    const isMock = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');

    if (isMock) {
      setLoading(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const initializeAuth = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), SESSION_TIMEOUT)
        );

        const sessionPromise = supabase.auth.getSession();
        const result = await Promise.race([sessionPromise, timeoutPromise]);

        setSession(result?.data?.session ?? null);
        if (result?.data?.session?.user) {
          await refreshProfile();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        try {
          setSession(session);
          if (session?.user) {
            await refreshProfile();
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          setLoading(false);
        }
      })();
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme from user profile
  useEffect(() => {
    if (user?.theme) setTheme(user.theme as 'light' | 'dark' | 'system');
  }, [user?.theme, setTheme]);

  const isAuthenticated = !!session || !!user;

  return { user, session, loading, isAuthenticated, signOut, refreshProfile };
}
