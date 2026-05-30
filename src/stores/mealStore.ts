import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal, MealType, FoodEntry } from '../types/meal';
import { getTodayString, generateId } from '../lib/utils';

interface MealState {
  meals: Meal[];
  loading: boolean;
  selectedDate: string;
  addMeal: (type: MealType, name: string, notes?: string, date?: string) => Meal;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  addFoodToMeal: (mealId: string, food: Omit<FoodEntry, 'id'>) => void;
  removeFoodFromMeal: (mealId: string, foodId: string) => void;
  getMealsByDate: (date: string) => Meal[];
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: [],
      loading: false,
      selectedDate: getTodayString(),

      addMeal: (type, name, notes, date) => {
        const meal: Meal = {
          id:         generateId(),
          user_id:    'local',
          type,
          date:       date || getTodayString(),
          name,
          notes,
          foods:      [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set(state => ({ meals: [...state.meals, meal] }));
        return meal;
      },

      updateMeal: (id, updates) => {
        set(state => ({
          meals: state.meals.map(m =>
            m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMeal: (id) => {
        set(state => ({ meals: state.meals.filter(m => m.id !== id) }));
      },

      addFoodToMeal: (mealId, food) => {
        const entry: FoodEntry = { ...food, id: generateId() };
        set(state => ({
          meals: state.meals.map(m =>
            m.id === mealId
              ? { ...m, foods: [...m.foods, entry], updated_at: new Date().toISOString() }
              : m
          ),
        }));
      },

      removeFoodFromMeal: (mealId, foodId) => {
        set(state => ({
          meals: state.meals.map(m =>
            m.id === mealId
              ? { ...m, foods: m.foods.filter(f => f.id !== foodId), updated_at: new Date().toISOString() }
              : m
          ),
        }));
      },

      getMealsByDate: (date) => get().meals.filter(m => m.date === date),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: 'nutrisnap-meals' }
  )
);
