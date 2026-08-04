-- Run this in your Supabase SQL Editor

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  team_name text default 'My Team',
  team_note text,
  updated_at timestamptz default now()
);

-- Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  jersey_number integer not null,
  position text not null,
  created_at timestamptz default now()
);

-- Formations table
create table if not exists formations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  formation_type text not null default '4-3-3',
  away_formation_type text default '4-3-3',
  match_date date,
  result text,
  notes text,
  home_team_name text default 'Home Team',
  away_team_name text default 'Away Team',
  created_at timestamptz default now()
);

-- Formation slots (which player is in which position)
create table if not exists formation_slots (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references formations(id) on delete cascade not null,
  player_id uuid references players(id) on delete set null,
  slot_key text not null,
  team text not null default 'home',  -- 'home' or 'away'
  is_substitute boolean default false
);

-- Row Level Security
alter table profiles enable row level security;
alter table players enable row level security;
alter table formations enable row level security;
alter table formation_slots enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Players policies
create policy "Users can view own players" on players for select using (auth.uid() = user_id);
create policy "Users can insert own players" on players for insert with check (auth.uid() = user_id);
create policy "Users can update own players" on players for update using (auth.uid() = user_id);
create policy "Users can delete own players" on players for delete using (auth.uid() = user_id);

-- Formations policies
create policy "Users can view own formations" on formations for select using (auth.uid() = user_id);
create policy "Users can insert own formations" on formations for insert with check (auth.uid() = user_id);
create policy "Users can update own formations" on formations for update using (auth.uid() = user_id);
create policy "Users can delete own formations" on formations for delete using (auth.uid() = user_id);

-- Formation slots policies (inherit access through formation)
create policy "Users can view own formation slots" on formation_slots for select
  using (exists (select 1 from formations where formations.id = formation_slots.formation_id and formations.user_id = auth.uid()));
create policy "Users can insert own formation slots" on formation_slots for insert
  with check (exists (select 1 from formations where formations.id = formation_slots.formation_id and formations.user_id = auth.uid()));
create policy "Users can delete own formation slots" on formation_slots for delete
  using (exists (select 1 from formations where formations.id = formation_slots.formation_id and formations.user_id = auth.uid()));
