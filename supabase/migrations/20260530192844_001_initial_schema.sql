/*
  # Initial Schema for NutriSnap

  1. New Tables
    - `profiles` - User profile data linked to auth.users
    - `nutrition_goals` - Daily macro and calorie targets
    - `meals` - Meal records (breakfast, lunch, dinner, snack)
    - `meal_foods` - Individual food items within meals
    - `water_logs` - Daily water intake entries
    - `food_library` - User's custom saved foods

  2. Security
    - Enable RLS on all tables
    - Policies restrict access to authenticated users owning the data
    - Trigger auto-creates profile on user signup

  3. Important Notes
    - All tables use UUID primary keys
    - Timestamps are in ISO 8601 format
    - Cascading deletes ensure data integrity when users are deleted
*/

-- Enable UUID extension if not exists
create extension if not exists "uuid-ossp";

-- ─── User Profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text default '',
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

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ─── Nutrition Goals ──────────────────────────────────────────────────────────
create table if not exists public.nutrition_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  calories numeric default 2000,
  protein numeric default 150,
  carbs numeric default 200,
  fat numeric default 65,
  water numeric default 2500,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.nutrition_goals enable row level security;

create policy "Users can manage own goals"
  on public.nutrition_goals for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Meals ────────────────────────────────────────────────────────────────────
create table if not exists public.meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('breakfast', 'lunch', 'dinner', 'snack')),
  date date not null,
  name text not null default '',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meals enable row level security;

create policy "Users can manage own meals"
  on public.meals for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists meals_user_date_idx on public.meals(user_id, date);

-- ─── Meal Foods ────────────────────────────────────────────────────────────────
create table if not exists public.meal_foods (
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

create policy "Users can manage own meal foods"
  on public.meal_foods for all
  to authenticated
  using (
    exists (
      select 1 from public.meals
      where meals.id = meal_foods.meal_id
      and meals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.meals
      where meals.id = meal_foods.meal_id
      and meals.user_id = auth.uid()
    )
  );

-- ─── Water Logs ────────────────────────────────────────────────────────────────
create table if not exists public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount_ml numeric not null,
  logged_at timestamptz default now()
);

alter table public.water_logs enable row level security;

create policy "Users can manage own water logs"
  on public.water_logs for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists water_logs_user_date_idx on public.water_logs(user_id, logged_at);

-- ─── Food Library ─────────────────────────────────────────────────────────────
create table if not exists public.food_library (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  brand text,
  serving_size numeric not null default 100,
  serving_unit text default 'g',
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.food_library enable row level security;

create policy "Users can manage own food library"
  on public.food_library for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.nutrition_goals (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Update timestamp trigger function ──────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply update triggers to relevant tables
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists nutrition_goals_updated_at on public.nutrition_goals;
create trigger nutrition_goals_updated_at
  before update on public.nutrition_goals
  for each row execute function public.update_updated_at();

drop trigger if exists meals_updated_at on public.meals;
create trigger meals_updated_at
  before update on public.meals
  for each row execute function public.update_updated_at();

drop trigger if exists food_library_updated_at on public.food_library;
create trigger food_library_updated_at
  before update on public.food_library
  for each row execute function public.update_updated_at();
