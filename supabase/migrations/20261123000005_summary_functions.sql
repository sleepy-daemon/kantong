-- Aggregations replace the blueprint's Edge Functions.
-- SECURITY INVOKER: they run as the caller, so transactions RLS still applies.
-- Date ranges are half-open: [p_start, p_end).

create or replace function public.get_period_summary(p_start date, p_end date)
returns table (income numeric, expenses numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(sum(amount) filter (where type = 'income'), 0)  as income,
    coalesce(sum(amount) filter (where type = 'expense'), 0) as expenses
  from public.transactions
  where date >= p_start and date < p_end;
$$;

create or replace function public.get_category_breakdown(p_start date, p_end date)
returns table (
  category_id    uuid,
  category_name  text,
  category_icon  text,
  category_color text,
  total          numeric,
  percentage     numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  with totals as (
    select t.category_id, sum(t.amount) as total
    from public.transactions t
    where t.type = 'expense' and t.date >= p_start and t.date < p_end
    group by t.category_id
  )
  select
    totals.category_id,
    coalesce(c.name, 'Uncategorized'),
    coalesce(c.icon, '📦'),
    coalesce(c.color, '#9CA3AF'),
    totals.total,
    round(totals.total * 100 / nullif(sum(totals.total) over (), 0), 2)
  from totals
  left join public.categories c on c.id = totals.category_id
  order by totals.total desc;
$$;

create or replace function public.get_balance()
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(case when type = 'income' then amount else -amount end), 0)
  from public.transactions;
$$;

revoke execute on function public.get_period_summary(date, date)     from public, anon;
revoke execute on function public.get_category_breakdown(date, date) from public, anon;
revoke execute on function public.get_balance()                      from public, anon;
grant  execute on function public.get_period_summary(date, date)     to authenticated;
grant  execute on function public.get_category_breakdown(date, date) to authenticated;
grant  execute on function public.get_balance()                      to authenticated;
