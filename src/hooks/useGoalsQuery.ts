import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import * as db from '../lib/db';
import { NutritionGoals } from '../types/nutrition';

// ─── Query Keys ────────────────────────────────────────────────────────────────
const goalKeys = {
  all: (userId: string) => ['goals', userId] as const,
};

// ─── Goals Query ─────────────────────────────────────────────────────────────────

export function useGoals() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: goalKeys.all(userId || ''),
    queryFn: () => db.getGoals(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ─── Goals Mutation ──────────────────────────────────────────────────────────────

export function useUpdateGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: (goals: NutritionGoals) => db.updateGoals(userId!, goals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all(userId || '') });
    },
  });
}
