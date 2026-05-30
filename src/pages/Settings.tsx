import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { LogOut, User, Moon, Sun, Monitor, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { setUser } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || '');

  const handleSaveProfile = () => {
    if (!user) return;
    setUser({ ...user, full_name: editName });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="card p-6">
          <h3 className="section-title mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-base py-1.5 px-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="btn-primary py-1 px-3 text-xs">Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-bold text-lg">{user?.full_name || 'User'}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </>
              )}
            </div>
          </div>
          {!isEditing && (
            <div className="mt-6">
              <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit Profile</button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <h3 className="section-title mb-6 flex items-center gap-2"><Monitor className="w-5 h-5" /> Preferences</h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Theme</h4>
                <p className="text-xs text-muted-foreground">Select your interface color scheme</p>
              </div>
              <div className="flex bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
                {(['light', 'dark', 'system'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium capitalize flex items-center gap-2 transition-all",
                      theme === t ? "bg-white dark:bg-surface-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === 'light' && <Sun className="w-4 h-4" />}
                    {t === 'dark' && <Moon className="w-4 h-4" />}
                    {t === 'system' && <Monitor className="w-4 h-4" />}
                    <span className="hidden sm:inline">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Notifications</h4>
                <p className="text-xs text-muted-foreground">Daily reminders and insights</p>
              </div>
              <button className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-100 dark:border-red-900/30">
          <h3 className="section-title text-red-500 mb-4">Account</h3>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
