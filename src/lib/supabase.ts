import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── SQL Schema (run in Supabase SQL Editor) ─────────────────────────────────
/*
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  date_of_birth date,
  weight_kg numeric,
  height_cm numeric,
  activity_level text default 'moderately_active',
  units text default 'metric',
  theme text default 'system',
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Nutrition Goals
create table public.nutrition_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  calories numeric default 2000,
  protein numeric default 150,
  carbs numeric default 200,
  fat numeric default 65,
  water numeric default 2500,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);
alter table public.nutrition_goals enable row level security;
create policy "Users can manage own goals" on nutrition_goals for all using (auth.uid() = user_id);

-- Meals
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  date date not null,
  name text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.meals enable row level security;
create policy "Users can manage own meals" on meals for all using (auth.uid() = user_id);
create index meals_user_date_idx on meals(user_id, date);

-- Meal Foods
create table public.meal_foods (
  id uuid default uuid_generate_v4() primary key,
  meal_id uuid references public.meals on delete cascade not null,
  food_id text not null,
  name text not null,
  quantity numeric not null default 1,
  unit text not null default 'serving',
  serving_size numeric not null default 100,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz default now()
);
alter table public.meal_foods enable row level security;
create policy "Users can manage own meal foods" on meal_foods for all
  using (exists (select 1 from meals where meals.id = meal_foods.meal_id and meals.user_id = auth.uid()));

-- Water Logs
create table public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount_ml numeric not null,
  logged_at timestamptz default now()
);
alter table public.water_logs enable row level security;
create policy "Users can manage own water logs" on water_logs for all using (auth.uid() = user_id);
create index water_logs_user_date_idx on water_logs(user_id, logged_at);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  insert into public.nutrition_goals (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
*/
