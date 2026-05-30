import { MacroNutrients, NutritionGoals, DailyNutrition, DailyProgress, MacroProgress } from '../types/nutrition';
import { Meal } from '../types/meal';

// BMR using Mifflin-St Jeor equation
export function calcBMR(weightKg: number, heightCm: number, ageyears: number, isMale: boolean): number {
  if (isMale) {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageyears + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * ageyears - 161;
}

// TDEE from BMR and activity multiplier
export function calcTDEE(bmr: number, activityMultiplier: number): number {
  return Math.round(bmr * activityMultiplier);
}

// Sum macros from meals
export function sumMealNutrition(meals: Meal[]): MacroNutrients {
  return meals.reduce(
    (acc, meal) => {
      const mealTotal = meal.foods.reduce(
        (mAcc, food) => ({
          calories: mAcc.calories + food.calories,
          protein:  mAcc.protein  + food.protein,
          carbs:    mAcc.carbs    + food.carbs,
          fat:      mAcc.fat      + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      return {
        calories: acc.calories + mealTotal.calories,
        protein:  acc.protein  + mealTotal.protein,
        carbs:    acc.carbs    + mealTotal.carbs,
        fat:      acc.fat      + mealTotal.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

// Build MacroProgress object
export function buildProgress(consumed: number, goal: number): MacroProgress {
  const percentage = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;
  return { consumed: Math.round(consumed), goal: Math.round(goal), percentage, remaining: Math.max(0, Math.round(goal - consumed)) };
}

// Build full daily progress
export function buildDailyProgress(nutrition: DailyNutrition, goals: NutritionGoals): DailyProgress {
  return {
    calories: buildProgress(nutrition.calories, goals.calories),
    protein:  buildProgress(nutrition.protein,  goals.protein),
    carbs:    buildProgress(nutrition.carbs,    goals.carbs),
    fat:      buildProgress(nutrition.fat,      goals.fat),
    water:    buildProgress(nutrition.water,    goals.water),
  };
}

// Scale nutrition by serving
export function scaleNutrition(base: MacroNutrients, quantity: number, servingSize: number): MacroNutrients {
  const factor = (quantity * servingSize) / 100;
  return {
    calories: +(base.calories * factor).toFixed(1),
    protein:  +(base.protein  * factor).toFixed(1),
    carbs:    +(base.carbs    * factor).toFixed(1),
    fat:      +(base.fat      * factor).toFixed(1),
  };
}

// Goal completion rate across days
export function calcGoalCompletionRate(data: { calories: number; goal_calories: number }[]): number {
  if (!data.length) return 0;
  const hits = data.filter(d => {
    const pct = d.goal_calories > 0 ? (d.calories / d.goal_calories) : 0;
    return pct >= 0.8 && pct <= 1.2;
  }).length;
  return Math.round((hits / data.length) * 100);
}

// Consistency score (days logged out of period)
export function calcConsistencyScore(loggedDays: number, totalDays: number): number {
  if (totalDays <= 0) return 0;
  return Math.round((loggedDays / totalDays) * 100);
}
