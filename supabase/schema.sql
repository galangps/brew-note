-- Brew-Note V3.0 — Supabase cloud schema
-- Run this entire file in Supabase Dashboard > SQL Editor.

create table if not exists public.brew_note_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{"recipes":[],"beans":[],"brews":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.brew_note_state enable row level security;

grant select, insert, update, delete
on table public.brew_note_state
to authenticated;

drop policy if exists "Users can read their own Brew-Note data"
on public.brew_note_state;

create policy "Users can read their own Brew-Note data"
on public.brew_note_state
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own Brew-Note data"
on public.brew_note_state;

create policy "Users can insert their own Brew-Note data"
on public.brew_note_state
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Brew-Note data"
on public.brew_note_state;

create policy "Users can update their own Brew-Note data"
on public.brew_note_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own Brew-Note data"
on public.brew_note_state;

create policy "Users can delete their own Brew-Note data"
on public.brew_note_state
for delete
to authenticated
using (auth.uid() = user_id);
