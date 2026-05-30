import { supabase } from './supabase';
import { Meal, MealType, FoodEntry } from '../types/meal';
import { NutritionGoals } from '../types/nutrition';
import { UserProfile } from '../types/user';

// ─── Profile Services ────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeOnboarding(userId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_complete: true })
    .eq('id', userId);

  if (error) throw error;
}

// ─── Goals Services ────────────────────────────────────────────────────────────

export async function getGoals(userId: string): Promise<NutritionGoals | null> {
  const { data, error } = await supabase
    .from('nutrition_goals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    calories: Number(data.calories),
    protein: Number(data.protein),
    carbs: Number(data.carbs),
    fat: Number(data.fat),
    water: Number(data.water),
  };
}

export async function updateGoals(userId: string, goals: NutritionGoals): Promise<NutritionGoals> {
  const { data, error } = await supabase
    .from('nutrition_goals')
    .upsert({
      user_id: userId,
      calories: goals.calories,
      protein: goals.protein,
      carbs: goals.carbs,
      fat: goals.fat,
      water: goals.water,
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;

  return {
    calories: Number(data.calories),
    protein: Number(data.protein),
    carbs: Number(data.carbs),
    fat: Number(data.fat),
    water: Number(data.water),
  };
}

// ─── Meal Services ────────────────────────────────────────────────────────────

export async function getMealsByDate(userId: string, date: string): Promise<Meal[]> {
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('*, foods:meal_foods(*)')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (mealsError) throw mealsError;

  return (meals || []).map((m: any) => ({
    id: m.id,
    user_id: m.user_id,
    type: m.type as MealType,
    date: m.date,
    name: m.name || '',
    notes: m.notes,
    foods: (m.foods || []).map((f: any) => ({
      id: f.id,
      food_id: f.food_id,
      name: f.name,
      quantity: Number(f.quantity),
      unit: f.unit,
      serving_size: Number(f.serving_size),
      calories: Number(f.calories),
      protein: Number(f.protein),
      carbs: Number(f.carbs),
      fat: Number(f.fat),
    })),
    created_at: m.created_at,
    updated_at: m.updated_at,
  }));
}

export async function createMeal(userId: string, type: MealType, date: string, name?: string, notes?: string): Promise<Meal> {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      type,
      date,
      name: name || `${type} on ${date}`,
      notes,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    user_id: data.user_id,
    type: data.type as MealType,
    date: data.date,
    name: data.name || '',
    notes: data.notes,
    foods: [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function deleteMeal(mealId: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);

  if (error) throw error;
}

// ─── Meal Food Services ──────────────────────────────────────────────────────────

export async function addFoodToMeal(mealId: string, food: Omit<FoodEntry, 'id'>): Promise<FoodEntry> {
  const { data, error } = await supabase
    .from('meal_foods')
    .insert({
      meal_id: mealId,
      food_id: food.food_id,
      name: food.name,
      quantity: food.quantity,
      unit: food.unit,
      serving_size: food.serving_size,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    food_id: data.food_id,
    name: data.name,
    quantity: Number(data.quantity),
    unit: data.unit,
    serving_size: Number(data.serving_size),
    calories: Number(data.calories),
    protein: Number(data.protein),
    carbs: Number(data.carbs),
    fat: Number(data.fat),
  };
}

export async function removeFoodFromMeal(foodId: string): Promise<void> {
  const { error } = await supabase
    .from('meal_foods')
    .delete()
    .eq('id', foodId);

  if (error) throw error;
}

export async function updateFoodEntry(foodId: string, updates: Partial<FoodEntry>): Promise<FoodEntry> {
  const { data, error } = await supabase
    .from('meal_foods')
    .update({
      quantity: updates.quantity,
      calories: updates.calories,
      protein: updates.protein,
      carbs: updates.carbs,
      fat: updates.fat,
    })
    .eq('id', foodId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    food_id: data.food_id,
    name: data.name,
    quantity: Number(data.quantity),
    unit: data.unit,
    serving_size: Number(data.serving_size),
    calories: Number(data.calories),
    protein: Number(data.protein),
    carbs: Number(data.carbs),
    fat: Number(data.fat),
  };
}

// ─── Water Services ──────────────────────────────────────────────────────────────

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
}

export async function getWaterLogs(userId: string, date?: string): Promise<WaterLog[]> {
  let query = supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });

  if (date) {
    query = query.gte('logged_at', `${date}T00:00:00Z`).lte('logged_at', `${date}T23:59:59Z`);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((w: any) => ({
    id: w.id,
    amount_ml: Number(w.amount_ml),
    logged_at: w.logged_at,
  }));
}

export async function addWaterLog(userId: string, amountMl: number): Promise<WaterLog> {
  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    amount_ml: Number(data.amount_ml),
    logged_at: data.logged_at,
  };
}

export async function deleteWaterLog(logId: string): Promise<void> {
  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', logId);

  if (error) throw error;
}

// ─── Food Library Services ────────────────────────────────────────────────────────

export interface FoodLibraryItem {
  id: string;
  name: string;
  brand?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  usage_count: number;
}

export async function getFoodLibrary(userId: string): Promise<FoodLibraryItem[]> {
  const { data, error } = await supabase
    .from('food_library')
    .select('*')
    .eq('user_id', userId)
    .order('usage_count', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw error;

  return (data || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    brand: f.brand,
    serving_size: Number(f.serving_size),
    serving_unit: f.serving_unit,
    calories: Number(f.calories),
    protein: Number(f.protein),
    carbs: Number(f.carbs),
    fat: Number(f.fat),
    usage_count: f.usage_count,
  }));
}

export async function addToFoodLibrary(userId: string, food: Omit<FoodLibraryItem, 'id' | 'usage_count'>): Promise<FoodLibraryItem> {
  const { data, error } = await supabase
    .from('food_library')
    .insert({
      user_id: userId,
      name: food.name,
      brand: food.brand,
      serving_size: food.serving_size,
      serving_unit: food.serving_unit,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    serving_size: Number(data.serving_size),
    serving_unit: data.serving_unit,
    calories: Number(data.calories),
    protein: Number(data.protein),
    carbs: Number(data.carbs),
    fat: Number(data.fat),
    usage_count: data.usage_count,
  };
}

export async function incrementFoodUsage(foodId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_food_usage', { food_id: foodId });
  // If the function doesn't exist, we can do a manual update
  if (error && error.code === 'PGRST202') {
    await supabase
      .from('food_library')
      .update({ usage_count: supabase.rpc('increment_food_usage', { food_id: foodId }) })
      .eq('id', foodId);
  }
}

export async function deleteFromFoodLibrary(foodId: string): Promise<void> {
  const { error } = await supabase
    .from('food_library')
    .delete()
    .eq('id', foodId);

  if (error) throw error;
}

// ─── Analytics Helpers ────────────────────────────────────────────────────────────

export async function getMealsInRange(userId: string, startDate: string, endDate: string): Promise<Meal[]> {
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('*, foods:meal_foods(*)')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (mealsError) throw mealsError;

  return (meals || []).map((m: any) => ({
    id: m.id,
    user_id: m.user_id,
    type: m.type as MealType,
    date: m.date,
    name: m.name || '',
    notes: m.notes,
    foods: (m.foods || []).map((f: any) => ({
      id: f.id,
      food_id: f.food_id,
      name: f.name,
      quantity: Number(f.quantity),
      unit: f.unit,
      serving_size: Number(f.serving_size),
      calories: Number(f.calories),
      protein: Number(f.protein),
      carbs: Number(f.carbs),
      fat: Number(f.fat),
    })),
    created_at: m.created_at,
    updated_at: m.updated_at,
  }));
}
