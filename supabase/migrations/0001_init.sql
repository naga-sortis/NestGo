-- NestGo core schema. Run this in the Supabase SQL editor (or via the
-- Supabase CLI) once per project. Safe to re-run — every statement is
-- idempotent.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Settle: peer-to-peer hand-off listings
-- ---------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  neighborhood text not null,
  city text not null,
  price numeric not null,
  currency text not null,
  move_date date,
  items text[] not null default '{}',
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

drop policy if exists "listings are publicly readable" on public.listings;
create policy "listings are publicly readable"
  on public.listings for select
  to anon
  using (true);

drop policy if exists "anyone can submit a listing" on public.listings;
create policy "anyone can submit a listing"
  on public.listings for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------
-- Social: neighborhood routine loops
-- ---------------------------------------------------------------------
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  neighborhood text not null,
  city text not null,
  schedule text not null,
  spots_total int not null,
  spots_filled int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.routines enable row level security;

drop policy if exists "routines are publicly readable" on public.routines;
create policy "routines are publicly readable"
  on public.routines for select
  to anon
  using (true);

-- No direct UPDATE policy for anon — joining a loop goes through the
-- join_routine() function below, so a client can't set spots_filled to an
-- arbitrary value.
create or replace function public.join_routine(routine_id uuid)
returns public.routines
language plpgsql
security definer
set search_path = public
as $$
declare
  updated public.routines;
begin
  update public.routines
    set spots_filled = spots_filled + 1
    where id = routine_id and spots_filled < spots_total
    returning * into updated;
  return updated;
end;
$$;

grant execute on function public.join_routine(uuid) to anon;

-- ---------------------------------------------------------------------
-- Feedback
-- ---------------------------------------------------------------------
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback"
  on public.feedback for insert
  to anon
  with check (true);

-- No SELECT policy for anon — comments stay private to the project owner.
-- The public only ever sees the aggregate via feedback_summary().
create or replace function public.feedback_summary()
returns table (average numeric, count bigint)
language sql
security definer
set search_path = public
as $$
  select avg(rating)::numeric(10, 2), count(*) from public.feedback;
$$;

grant execute on function public.feedback_summary() to anon;

-- ---------------------------------------------------------------------
-- Discover: destination guides
-- ---------------------------------------------------------------------
create table if not exists public.destination_guides (
  country text primary key,
  best_season text not null,
  transport text[] not null default '{}',
  cultural_highlights text[] not null default '{}',
  solo_trip_ideas text[] not null default '{}',
  family_trip_ideas text[] not null default '{}',
  last_verified_at date not null default current_date
);

alter table public.destination_guides enable row level security;

drop policy if exists "destination guides are publicly readable" on public.destination_guides;
create policy "destination guides are publicly readable"
  on public.destination_guides for select
  to anon
  using (true);

-- ---------------------------------------------------------------------
-- Secure: visa checklist content
-- scope = 'purpose' (scope_key is a Purpose value) or 'country'
-- (scope_key is a destination country name).
-- ---------------------------------------------------------------------
create table if not exists public.visa_checklist_items (
  scope text not null check (scope in ('purpose', 'country')),
  scope_key text not null,
  item_id text not null,
  label text not null,
  instructions text not null,
  online boolean not null default false,
  fields jsonb not null default '[]',
  last_verified_at date not null default current_date,
  primary key (scope, scope_key, item_id)
);

alter table public.visa_checklist_items enable row level security;

drop policy if exists "visa checklist items are publicly readable" on public.visa_checklist_items;
create policy "visa checklist items are publicly readable"
  on public.visa_checklist_items for select
  to anon
  using (true);
