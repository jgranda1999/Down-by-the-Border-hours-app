-- ============================================
-- DOWN BY THE BORDER - Volunteer Hours Tracker
-- Initial schema
-- ============================================
-- Run this in Supabase SQL Editor on a fresh project.

-- 1. PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text,
  school text,
  title text,
  parent_name text,
  parent_phone text,
  parent_email text,
  role text not null default 'volunteer' check (role in ('volunteer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. HOUR_LOGS
create table public.hour_logs (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.profiles(id) on delete cascade,
  event_name text not null,
  event_date date not null,
  sign_in_time timestamptz not null,
  sign_out_time timestamptz,
  hours numeric(5,2) not null check (hours > 0 and hours <= 24),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hour_logs_volunteer_id_idx on public.hour_logs(volunteer_id);
create index hour_logs_event_date_idx on public.hour_logs(event_date);
create index profiles_school_idx on public.profiles(school);
create index profiles_role_idx on public.profiles(role);

-- 3. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. AUTO-UPDATE updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger hour_logs_updated_at
  before update on public.hour_logs
  for each row execute function public.set_updated_at();

-- 5. is_admin() helper
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.hour_logs enable row level security;

-- PROFILES
create policy "View own profile or all if admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Update own profile (not role)"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- HOUR_LOGS
create policy "View own logs or all if admin"
  on public.hour_logs for select
  using (auth.uid() = volunteer_id or public.is_admin());

create policy "Insert own logs"
  on public.hour_logs for insert
  with check (auth.uid() = volunteer_id);

create policy "Update own recent logs or any if admin"
  on public.hour_logs for update
  using (
    (auth.uid() = volunteer_id and created_at > now() - interval '24 hours')
    or public.is_admin()
  );

create policy "Admins can delete logs"
  on public.hour_logs for delete
  using (public.is_admin());

create policy "Delete own recent logs"
  on public.hour_logs for delete
  using (
    auth.uid() = volunteer_id
    and created_at > now() - interval '24 hours'
  );
