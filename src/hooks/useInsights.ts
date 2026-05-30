import { useMemo } from 'react';
import { generateDailyInsights, generateWeeklyInsights } from '../lib/insightsEngine';
import { useDailyProgress } from './useDailyProgress';
import { useAnalytics } from './useAnalytics';

export function useInsights() {
  const { progress } = useDailyProgress();
  const { weeklyStats } = useAnalytics(7);

  const dailyInsights  = useMemo(() => generateDailyInsights(progress), [progress]);
  const weeklyInsights = useMemo(() => generateWeeklyInsights(weeklyStats), [weeklyStats]);

  return { dailyInsights, weeklyInsights };
}
