import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshProfile } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
        console.warn("Using mock login due to placeholder Supabase config.");
        useAuthStore.getState().setUser({
          id: 'mock-id', email, full_name: 'Demo User', units: 'metric', theme: 'system', onboarding_complete: true, created_at: '', updated_at: ''
        });
        navigate('/dashboard');
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-8">
        <Link to="/" className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center">
          <span className="text-white text-xl font-bold">N</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-2">Log in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                {error}
              </div>
            )}

            <button 
              type="button" 
              onClick={async () => {
                if (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
                  alert('Google Sign-In is disabled in demo mode. Please use email/password.');
                  return;
                }
                const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
                if (error) setError(error.message);
              }}
              className="btn-secondary w-full py-3 flex items-center justify-center gap-3 bg-white hover:bg-surface-50 text-black border border-border"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase font-medium">Or continue with</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email address</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="input-base" placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500">Forgot password?</Link>
              </div>
              <input
                type="password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                className="input-base" placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
