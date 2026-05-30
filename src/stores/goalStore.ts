import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NutritionGoals } from '../types/nutrition';

interface GoalState {
  goals: NutritionGoals;
  loading: boolean;
  setGoals: (goals: NutritionGoals) => void;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein:  150,
  carbs:    200,
  fat:      65,
  water:    2500,
};

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: DEFAULT_GOALS,
      loading: false,
      setGoals: (goals) => set({ goals }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: 'nutrisnap-goals' }
  )
);
