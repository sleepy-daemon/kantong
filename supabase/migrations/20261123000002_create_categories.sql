-- Categories: system rows (user_id null) are shared; user rows are private.
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text not null check (char_length(name) between 1 and 50),
  icon        text,
  color       text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  type        text not null check (type in ('income', 'expense', 'both')),
  is_system   boolean not null default false,
  created_at  timestamptz not null default now(),
  constraint categories_owner_check check (
    (is_system and user_id is null) or (not is_system and user_id is not null)
  )
);

create index categories_user_id_idx on public.categories (user_id);

alter table public.categories enable row level security;

create policy categories_select on public.categories for select to authenticated
  using (is_system or (select auth.uid()) = user_id);
create policy categories_insert on public.categories for insert to authenticated
  with check ((select auth.uid()) = user_id and not is_system);
create policy categories_update on public.categories for update to authenticated
  using ((select auth.uid()) = user_id and not is_system)
  with check ((select auth.uid()) = user_id and not is_system);
create policy categories_delete on public.categories for delete to authenticated
  using ((select auth.uid()) = user_id and not is_system);
