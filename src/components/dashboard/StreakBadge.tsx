import { Flame } from 'lucide-react';
import { cn, getStreakColor } from '../../lib/utils';

export function StreakBadge({ streak, className }: { streak: number, className?: string }) {
  const colorClass = getStreakColor(streak);

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-900 border border-border shadow-sm",
      className
    )}>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-surface-950 shadow-sm", colorClass)}>
        <Flame className={cn("w-4 h-4", streak > 0 ? "fill-current" : "")} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Streak</span>
        <span className="text-lg font-bold leading-none">{streak} <span className="text-sm font-medium text-muted-foreground">Days</span></span>
      </div>
    </div>
  );
}
