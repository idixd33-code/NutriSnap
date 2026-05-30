import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const goalsSchema = z.object({
  calories: z.coerce.number().min(800, 'Min 800 kcal').max(10000, 'Max 10,000 kcal'),
  protein:  z.coerce.number().min(10,  'Min 10g').max(600, 'Max 600g'),
  carbs:    z.coerce.number().min(10,  'Min 10g').max(1000, 'Max 1,000g'),
  fat:      z.coerce.number().min(10,  'Min 10g').max(400, 'Max 400g'),
  water:    z.coerce.number().min(500, 'Min 500ml').max(10000, 'Max 10,000ml'),
});

export const mealSchema = z.object({
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1, 'Meal name is required').max(100),
  notes: z.string().max(500).optional(),
  date: z.string(),
});

export const profileSchema = z.object({
  full_name:      z.string().min(2, 'Name too short'),
  date_of_birth:  z.string().optional(),
  weight_kg:      z.coerce.number().min(20).max(500).optional(),
  height_cm:      z.coerce.number().min(50).max(300).optional(),
  activity_level: z.enum(['sedentary','lightly_active','moderately_active','very_active','extremely_active']).optional(),
  units:          z.enum(['metric', 'imperial']),
});

export const addFoodSchema = z.object({
  quantity:     z.coerce.number().min(0.1, 'Must be > 0').max(9999),
  serving_size: z.coerce.number().min(1).max(9999),
  meal_id:      z.string().min(1, 'Select a meal'),
});

export type LoginFormData         = z.infer<typeof loginSchema>;
export type RegisterFormData      = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData= z.infer<typeof forgotPasswordSchema>;
export type GoalsFormData         = z.infer<typeof goalsSchema>;
export type MealFormData          = z.infer<typeof mealSchema>;
export type ProfileFormData       = z.infer<typeof profileSchema>;
export type AddFoodFormData       = z.infer<typeof addFoodSchema>;
