import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import * as db from '../lib/db';
import { MealType, FoodEntry } from '../types/meal';

// ─── Query Keys ────────────────────────────────────────────────────────────────
const mealKeys = {
  all: (userId: string) => ['meals', userId] as const,
  byDate: (userId: string, date: string) => ['meals', userId, date] as const,
  range: (userId: string, start: string, end: string) => ['meals', userId, 'range', start, end] as const,
};

// ─── Meal Queries ──────────────────────────────────────────────────────────────

export function useMealsByDate(date: string) {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: mealKeys.byDate(userId || '', date),
    queryFn: () => db.getMealsByDate(userId!, date),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useMealsInRange(startDate: string, endDate: string) {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: mealKeys.range(userId || '', startDate, endDate),
    queryFn: () => db.getMealsInRange(userId!, startDate, endDate),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ─── Meal Mutations ────────────────────────────────────────────────────────────

export function useCreateMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ type, date, name, notes }: { type: MealType; date: string; name?: string; notes?: string }) =>
      db.createMeal(userId!, type, date, name, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.byDate(userId || '', variables.date) });
    },
  });
}

export function useDeleteMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ mealId, date }: { mealId: string; date: string }) => db.deleteMeal(mealId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.byDate(userId || '', variables.date) });
    },
  });
}

export function useAddFoodToMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ mealId, food, date }: { mealId: string; food: Omit<FoodEntry, 'id'>; date: string }) =>
      db.addFoodToMeal(mealId, food),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.byDate(userId || '', variables.date) });
    },
  });
}

export function useRemoveFoodFromMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ foodId, date }: { foodId: string; date: string }) =>
      db.removeFoodFromMeal(foodId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.byDate(userId || '', variables.date) });
    },
  });
}
