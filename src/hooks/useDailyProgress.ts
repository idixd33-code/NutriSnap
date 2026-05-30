import { useMemo } from 'react';
import { useMealStore } from '../stores/mealStore';
import { useGoalStore } from '../stores/goalStore';
import { useWaterStore } from '../stores/waterStore';
import { sumMealNutrition, buildDailyProgress } from '../lib/nutritionCalc';
import { getTodayString } from '../lib/utils';
import { DailyNutrition } from '../types/nutrition';

export function useDailyProgress(date?: string) {
  const targetDate = date || getTodayString();
  const getMealsByDate = useMealStore(s => s.getMealsByDate);
  const goals = useGoalStore(s => s.goals);
  const totalToday = useWaterStore(s => s.totalToday);
  const waterEntries = useWaterStore(s => s.entries);

  const meals = useMemo(() => getMealsByDate(targetDate), [getMealsByDate, targetDate]);

  const nutrition = useMemo((): DailyNutrition => {
    const macros = sumMealNutrition(meals);
    const waterForDate = date
      ? waterEntries
          .filter(e => e.logged_at.slice(0, 10) === date)
          .reduce((sum, e) => sum + e.amount_ml, 0)
      : totalToday;
    return { ...macros, water: waterForDate, date: targetDate };
  }, [meals, totalToday, waterEntries, date, targetDate]);

  const progress = useMemo(() => buildDailyProgress(nutrition, goals), [nutrition, goals]);

  return { meals, nutrition, progress, goals };
}
