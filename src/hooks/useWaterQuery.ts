import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import * as db from '../lib/db';
import { format } from 'date-fns';

// ─── Query Keys ────────────────────────────────────────────────────────────────
const waterKeys = {
  all: (userId: string) => ['water', userId] as const,
  byDate: (userId: string, date: string) => ['water', userId, date] as const,
};

// ─── Water Queries ────────────────────────────────────────────────────────────────

export function useWaterLogs(date?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: waterKeys.byDate(userId || '', targetDate),
    queryFn: () => db.getWaterLogs(userId!, targetDate),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useWaterTotal(date?: string) {
  const { data: logs = [] } = useWaterLogs(date);
  return logs.reduce((sum, log) => sum + log.amount_ml, 0);
}

// ─── Water Mutations ────────────────────────────────────────────────────────────────

export function useAddWaterLog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ amountMl, date }: { amountMl: number; date: string }) =>
      db.addWaterLog(userId!, amountMl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: waterKeys.byDate(userId || '', variables.date) });
    },
  });
}

export function useDeleteWaterLog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ logId, date }: { logId: string; date: string }) =>
      db.deleteWaterLog(logId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: waterKeys.byDate(userId || '', variables.date) });
    },
  });
}
