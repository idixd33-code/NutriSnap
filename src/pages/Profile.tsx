import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { useStreak } from '../hooks/useStreak';
import { Trophy, Flame, Target, User as UserIcon, Calendar, ArrowUp } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { weeklyStats } = useAnalytics();
  const { longestStreak } = useStreak();

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="page-title">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-4 border-white dark:border-surface-800 shadow-md flex items-center justify-center overflow-hidden mb-4">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <h2 className="text-xl font-bold">{user?.full_name || 'User'}</h2>
          <p className="text-sm text-muted-foreground mb-6">Member since 2024</p>
          
          <div className="w-full grid grid-cols-2 gap-4 border-t pt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{longestStreak}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Day Streak</span>
            </div>
            <div className="flex flex-col border-l">
              <span className="text-2xl font-bold">{weeklyStats.consistency_score}%</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Consistency</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="section-title">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AchievementCard icon={Flame} title="On Fire" desc="Reach a 7-day streak" unlocked={longestStreak >= 7} color="text-amber-500" bg="bg-amber-100" />
            <AchievementCard icon={Target} title="Sharpshooter" desc="Hit macros 5 days in a row" unlocked={false} color="text-emerald-500" bg="bg-emerald-100" />
            <AchievementCard icon={Calendar} title="Dedicated" desc="Log 30 consecutive days" unlocked={false} color="text-purple-500" bg="bg-purple-100" />
            <AchievementCard icon={ArrowUp} title="Level Up" desc="Complete your profile" unlocked={true} color="text-blue-500" bg="bg-blue-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ icon: Icon, title, desc, unlocked, color, bg }: any) {
  return (
    <div className={`card p-4 flex flex-col items-center text-center gap-3 transition-all ${unlocked ? '' : 'opacity-50 grayscale'}`}>
      <div className={`w-12 h-12 rounded-full ${bg} dark:bg-surface-800 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-[10px] text-muted-foreground mt-1">{desc}</p>
      </div>
      {unlocked && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />}
    </div>
  );
}
