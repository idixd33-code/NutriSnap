import { useMemo } from 'react';
import { useMealStore } from '../stores/mealStore';
import { useWaterStore } from '../stores/waterStore';
import { useGoalStore } from '../stores/goalStore';
import { sumMealNutrition } from '../lib/nutritionCalc';
import { format, subDays, parseISO } from 'date-fns';
import { DailyDataPoint, WeeklyStats } from '../types/analytics';
import { calcGoalCompletionRate, calcConsistencyScore } from '../lib/nutritionCalc';

export function useAnalytics(days: number = 7) {
  const getMealsByDate = useMealStore(s => s.getMealsByDate);
  const waterEntries   = useWaterStore(s => s.entries);
  const goals          = useGoalStore(s => s.goals);

  const dataPoints = useMemo((): DailyDataPoint[] => {
    return Array.from({ length: days }, (_, i) => {
      const date    = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
      const meals   = getMealsByDate(date);
      const macros  = sumMealNutrition(meals);
      const water   = waterEntries
        .filter(e => e.logged_at.slice(0, 10) === date)
        .reduce((sum, e) => sum + e.amount_ml, 0);
      return {
        date,
        calories:      Math.round(macros.calories),
        protein:       Math.round(macros.protein),
        carbs:         Math.round(macros.carbs),
        fat:           Math.round(macros.fat),
        water:         Math.round(water),
        goal_calories: goals.calories,
        goal_protein:  goals.protein,
        goal_carbs:    goals.carbs,
        goal_fat:      goals.fat,
        goal_water:    goals.water,
      };
    });
  }, [days, getMealsByDate, waterEntries, goals]);

  const weeklyStats = useMemo((): WeeklyStats => {
    const logged = dataPoints.filter(d => d.calories > 0);
    const n = logged.length || 1;
    return {
      avg_calories: logged.reduce((s, d) => s + d.calories, 0) / n,
      avg_protein:  logged.reduce((s, d) => s + d.protein,  0) / n,
      avg_carbs:    logged.reduce((s, d) => s + d.carbs,    0) / n,
      avg_fat:      logged.reduce((s, d) => s + d.fat,      0) / n,
      avg_water:    logged.reduce((s, d) => s + d.water,    0) / n,
      goal_completion_rate: calcGoalCompletionRate(dataPoints),
      consistency_score: calcConsistencyScore(logged.length, days),
      best_day:    logged.sort((a, b) => {
        const aPct = a.goal_calories > 0 ? Math.abs(1 - a.calories / a.goal_calories) : 1;
        const bPct = b.goal_calories > 0 ? Math.abs(1 - b.calories / b.goal_calories) : 1;
        return aPct - bPct;
      })[0]?.date || '',
      worst_day:   logged[logged.length - 1]?.date || '',
      streak:      calcStreak(dataPoints),
    };
  }, [dataPoints, days]);

  return { dataPoints, weeklyStats };
}

function calcStreak(points: DailyDataPoint[]): number {
  let streak = 0;
  const reversed = [...points].reverse();
  for (const p of reversed) {
    if (p.calories > 0) streak++;
    else break;
  }
  return streak;
}
