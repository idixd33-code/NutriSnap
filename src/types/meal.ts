import { MacroNutrients } from './nutrition';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry extends MacroNutrients {
  id: string;
  food_id: string;
  name: string;
  quantity: number;
  unit: string;
  serving_size: number;
  image_url?: string;
}

export interface Meal {
  id: string;
  user_id: string;
  type: MealType;
  date: string; // YYYY-MM-DD
  name: string;
  notes?: string;
  foods: FoodEntry[];
  created_at: string;
  updated_at: string;
}

export interface MealSummary extends MacroNutrients {
  id: string;
  type: MealType;
  name: string;
  food_count: number;
}

export const MEAL_TYPE_CONFIG: Record<MealType, { label: string; emoji: string; color: string; time: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅', color: 'text-amber-500',   time: '6–10 AM' },
  lunch:     { label: 'Lunch',     emoji: '☀️',  color: 'text-blue-500',    time: '12–2 PM' },
  dinner:    { label: 'Dinner',    emoji: '🌙',  color: 'text-purple-500',  time: '6–9 PM' },
  snack:     { label: 'Snack',     emoji: '🍎',  color: 'text-emerald-500', time: 'Any time' },
};
