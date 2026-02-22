-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Resumes table
create table if not exists public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'CV sans titre' not null,
  template_id text default 'classic' not null,
  personal_info jsonb default '{}'::jsonb not null,
  profile text default '' not null,
  education jsonb default '[]'::jsonb not null,
  experience jsonb default '[]'::jsonb not null,
  skills jsonb default '[]'::jsonb not null,
  languages jsonb default '[]'::jsonb not null,
  interests jsonb default '[]'::jsonb not null,
  custom_sections jsonb default '[]'::jsonb not null,
  color_primary text default '#0e7490' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists resumes_user_id_idx on public.resumes(user_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Resumes policies
create policy "Users can view their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can create their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create or replace trigger update_resumes_updated_at
  before update on public.resumes
  for each row execute procedure public.update_updated_at();
