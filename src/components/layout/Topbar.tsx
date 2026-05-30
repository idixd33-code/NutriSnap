import { format, subDays, addDays } from 'date-fns';
import { useMealStore } from '../../stores/mealStore';
import { useAuth } from '../../hooks/useAuth';
import { Bell, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTodayString } from '../../lib/utils';

export default function Topbar() {
  const { selectedDate, setSelectedDate } = useMealStore();
  const { user } = useAuth();
  
  const dateObj = new Date(selectedDate);
  const isTodayStr = selectedDate === getTodayString();

  const handlePrevDay = () => setSelectedDate(format(subDays(dateObj, 1), 'yyyy-MM-dd'));
  const handleNextDay = () => setSelectedDate(format(addDays(dateObj, 1), 'yyyy-MM-dd'));
  const handleToday = () => setSelectedDate(getTodayString());

  return (
    <header className="h-16 bg-white/40 dark:bg-black/40 backdrop-blur-3xl border-b border-white/50 dark:border-white/10 flex items-center justify-between px-4 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      
      {/* Search Bar - Hidden on mobile, visible on desktop */}
      <div className="flex items-center gap-1 md:gap-3 bg-surface-100 dark:bg-surface-800 p-1 rounded-full">
        <button onClick={handlePrevDay} className="p-1.5 rounded-full hover:bg-white dark:hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px] px-2 cursor-pointer" onClick={handleToday}>
          <span className="text-sm font-semibold whitespace-nowrap">
            {isTodayStr ? 'Today' : format(dateObj, 'MMM d, yyyy')}
          </span>
        </div>
        
        <button onClick={handleNextDay} className="p-1.5 rounded-full hover:bg-white dark:hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
        </button>
        
        <div className="h-6 w-px bg-border hidden md:block"></div>

        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <span className="text-sm font-medium hidden md:block truncate max-w-[100px]">
            {user?.full_name?.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
}
