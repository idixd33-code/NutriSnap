import { useMemo } from 'react';
import { useMealStore } from '../stores/mealStore';
import { format, subDays } from 'date-fns';
import { sumMealNutrition } from '../lib/nutritionCalc';

export function useStreak() {
  const getMealsByDate = useMealStore(s => s.getMealsByDate);

  const streak = useMemo(() => {
    let count = 0;
    let i = 0;
    while (i < 365) {
      const date  = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const meals = getMealsByDate(date);
      const { calories } = sumMealNutrition(meals);
      if (calories > 0) { count++; i++; }
      else break;
    }
    return count;
  }, [getMealsByDate]);

  const longestStreak = streak; // Could be extended with historical tracking

  return { streak, longestStreak };
}
