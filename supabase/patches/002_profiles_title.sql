-- Add staff title for admin profiles (optional for volunteers).
alter table public.profiles add column if not exists title text;
