import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/user';

interface AuthState {
  user: UserProfile | null;
  session: unknown;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setSession: (session: unknown) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
      },

      refreshProfile: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          set({ user: { ...data, email: user.email || '' } as UserProfile });
        }
        // Fallback: if profile doesn't exist (not using real Supabase), create mock
        if (!data && user) {
          const mockProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'User',
            units: 'metric',
            theme: 'system',
            onboarding_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          set({ user: mockProfile });
        }
      },
    }),
    {
      name: 'nutrisnap-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
