import { Flame, Target, Zap } from 'lucide-react';
import { DailyProgress } from '../../types/nutrition';
import { StreakBadge } from './StreakBadge';
import { formatCalories, getCompletionColor } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function StatsRow({ progress, streak }: { progress: DailyProgress, streak: number }) {
  const caloriesPct = progress.calories.percentage;
  const calColor = getCompletionColor(caloriesPct);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
      
      {/* Calories Consumed */}
      <div className="card p-4 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">Consumed</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold", calColor)}>
            {formatCalories(progress.calories.consumed)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">/ {formatCalories(progress.calories.goal)} kcal</span>
        </div>
      </div>

      {/* Calories Remaining */}
      <div className="card p-4 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Target className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">Remaining</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            {formatCalories(progress.calories.remaining)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">kcal</span>
        </div>
      </div>

      {/* Streak */}
      <div className="col-span-2 md:col-span-1 flex items-stretch">
        <StreakBadge streak={streak} className="w-full h-full justify-between flex-row-reverse md:flex-row" />
      </div>

    </div>
  );
}
