create table public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users on delete cascade,
  category_id   uuid references public.categories on delete set null,
  type          text not null check (type in ('income', 'expense')),
  amount        numeric(15, 2) not null check (amount > 0),
  description   text check (char_length(description) <= 200),
  date          date not null,
  receipt_url   text,
  is_recurring  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, date desc);
create index transactions_category_id_idx on public.transactions (category_id);

alter table public.transactions enable row level security;

-- A transaction may only reference a category the user can see
-- (the subquery is itself filtered by the categories RLS policy).
create policy transactions_select on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy transactions_insert on public.transactions for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (category_id is null or exists (select 1 from public.categories c where c.id = category_id))
  );
create policy transactions_update on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (category_id is null or exists (select 1 from public.categories c where c.id = category_id))
  );
create policy transactions_delete on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute function public.update_updated_at();
