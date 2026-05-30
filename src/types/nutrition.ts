// Core nutrition types
export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionGoals extends MacroNutrients {
  water: number; // ml
}

export interface DailyNutrition extends MacroNutrients {
  water: number; // ml
  date: string; // YYYY-MM-DD
}

export interface MacroProgress {
  consumed: number;
  goal: number;
  percentage: number;
  remaining: number;
}

export interface DailyProgress {
  calories: MacroProgress;
  protein: MacroProgress;
  carbs: MacroProgress;
  fat: MacroProgress;
  water: MacroProgress;
}
