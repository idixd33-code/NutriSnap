export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  date_of_birth?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: ActivityLevel;
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

export const ACTIVITY_LEVELS: Record<ActivityLevel, { label: string; multiplier: number; description: string }> = {
  sedentary:          { label: 'Sedentary',           multiplier: 1.2,  description: 'Little or no exercise' },
  lightly_active:     { label: 'Lightly Active',      multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
  moderately_active:  { label: 'Moderately Active',   multiplier: 1.55,  description: 'Moderate exercise 3-5 days/week' },
  very_active:        { label: 'Very Active',          multiplier: 1.725, description: 'Hard exercise 6-7 days/week' },
  extremely_active:   { label: 'Extremely Active',     multiplier: 1.9,   description: 'Very hard exercise & physical job' },
};

export type GoalType = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'custom';

export const GOAL_PRESETS: Record<GoalType, { label: string; description: string; macroRatio: { protein: number; carbs: number; fat: number } }> = {
  weight_loss:   { label: 'Weight Loss',    description: 'High protein, moderate carbs, low fat',  macroRatio: { protein: 0.35, carbs: 0.35, fat: 0.30 } },
  muscle_gain:   { label: 'Muscle Gain',    description: 'High protein, high carbs, moderate fat', macroRatio: { protein: 0.30, carbs: 0.45, fat: 0.25 } },
  maintenance:   { label: 'Maintenance',    description: 'Balanced macros for maintenance',         macroRatio: { protein: 0.25, carbs: 0.50, fat: 0.25 } },
  custom:        { label: 'Custom',         description: 'Set your own macro targets',              macroRatio: { protein: 0.25, carbs: 0.50, fat: 0.25 } },
};
