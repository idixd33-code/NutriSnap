import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
}

// Get today's date as YYYY-MM-DD
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// Format number with one decimal
export function formatNum(n: number): string {
  return n % 1 === 0 ? String(Math.round(n)) : n.toFixed(1);
}

// Format calories
export function formatCalories(cal: number): string {
  if (cal >= 1000) return `${(cal / 1000).toFixed(1)}k`;
  return Math.round(cal).toString();
}

// Format water amount
export function formatWater(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${Math.round(ml)}ml`;
}

// Get percentage (clamped 0–100)
export function getPercentage(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

// Get macro color
export function getMacroColor(macro: 'protein' | 'carbs' | 'fat'): string {
  const colors = {
    protein: '#10b981', // emerald
    carbs:   '#3b82f6', // blue
    fat:     '#f59e0b', // amber
  };
  return colors[macro];
}

// Get calories from macros
export function calcCalories(protein: number, carbs: number, fat: number): number {
  return protein * 4 + carbs * 4 + fat * 9;
}

// Truncate text
export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '…' : text;
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Generate local UUID
export function generateId(): string {
  return crypto.randomUUID();
}

// Color for completion percentage
export function getCompletionColor(pct: number): string {
  if (pct >= 90 && pct <= 110) return 'text-emerald-500';
  if (pct > 110) return 'text-red-500';
  if (pct >= 70) return 'text-amber-500';
  return 'text-surface-400';
}

// Streak color
export function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-purple-500';
  if (streak >= 14) return 'text-emerald-500';
  if (streak >= 7)  return 'text-amber-500';
  return 'text-surface-500';
}
