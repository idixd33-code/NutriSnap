import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const { user, session, loading, setUser, setSession, setLoading, signOut, refreshProfile } = useAuthStore();
  const { setTheme } = useUIStore();

  useEffect(() => {
    const isMock = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    
    if (isMock) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        refreshProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await refreshProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme from user profile
  useEffect(() => {
    if (user?.theme) setTheme(user.theme as 'light' | 'dark' | 'system');
  }, [user?.theme, setTheme]);

  const isAuthenticated = !!session || !!user;

  return { user, session, loading, isAuthenticated, signOut, refreshProfile };
}
