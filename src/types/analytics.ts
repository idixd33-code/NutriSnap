export interface DailyDataPoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  goal_calories: number;
  goal_protein: number;
  goal_carbs: number;
  goal_fat: number;
  goal_water: number;
}

export interface WeeklyStats {
  avg_calories: number;
  avg_protein: number;
  avg_carbs: number;
  avg_fat: number;
  avg_water: number;
  goal_completion_rate: number;
  consistency_score: number;
  best_day: string;
  worst_day: string;
  streak: number;
}

export interface MonthlyHeatmapDay {
  date: string;
  completion_rate: number;
  calories: number;
}

export type ChartPeriod = 'daily' | 'weekly' | 'monthly';
