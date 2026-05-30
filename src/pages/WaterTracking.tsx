import { useWaterStore } from '../stores/waterStore';
import { useGoalStore } from '../stores/goalStore';
import { Droplets, Plus, Trash2 } from 'lucide-react';
import { formatWater, getPercentage } from '../lib/utils';
import { format, parseISO } from 'date-fns';

export default function WaterTracking() {
  const { totalToday, entries, addWater, removeWater } = useWaterStore();
  const goal = useGoalStore(s => s.goals.water);

  const percentage = getPercentage(totalToday, goal);
  const todayEntries = entries.filter(e => new Date(e.logged_at).toDateString() === new Date().toDateString()).sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime());

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-lg mx-auto w-full">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="page-title">Water Tracker</h1>
        <p className="page-subtitle">Stay hydrated, stay healthy</p>
      </div>

      {/* Big Circular Progress */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-64 h-64">
          {/* Background Ring */}
          <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
            <circle cx="128" cy="128" r="116" fill="none" stroke="currentColor" strokeWidth="24" className="text-surface-100 dark:text-surface-800" />
            <circle
              cx="128" cy="128" r="116"
              fill="none" stroke="#3b82f6" strokeWidth="24" strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 116} ${2 * Math.PI * 116}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-4xl font-black">{formatWater(totalToday).replace('ml','').replace('L','')}</span>
            <span className="text-sm font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{totalToday >= 1000 ? 'Liters' : 'ml'} / {formatWater(goal)}</span>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[250, 500, 750, 1000].map(amount => (
          <button
            key={amount}
            onClick={() => addWater(amount)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">{amount}ml</span>
          </button>
        ))}
      </div>

      {/* History log */}
      <div className="card p-5 mt-4">
        <h3 className="section-title mb-4">Today's Log</h3>
        {todayEntries.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">No water logged yet today.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {todayEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{entry.amount_ml} ml</p>
                    <p className="text-xs text-muted-foreground">{format(parseISO(entry.logged_at), 'h:mm a')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeWater(entry.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
