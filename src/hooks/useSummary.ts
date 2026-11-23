import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';
import { monthRange } from '@/utils/date';

export function useMonthlySummary(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.summary(year, month),
    queryFn: async () => {
      const { start, end } = monthRange(year, month);
      const { data, error } = await supabase.rpc('get_period_summary', { p_start: start, p_end: end });
      if (error) throw error;
      const row = data[0] ?? { income: 0, expenses: 0 };
      const income = Number(row.income);
      const expenses = Number(row.expenses);
      return { income, expenses, net: income - expenses };
    },
  });
}

export function useCategoryBreakdown(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.breakdown(year, month),
    queryFn: async () => {
      const { start, end } = monthRange(year, month);
      const { data, error } = await supabase.rpc('get_category_breakdown', { p_start: start, p_end: end });
      if (error) throw error;
      return data.map((r) => ({ ...r, total: Number(r.total), percentage: Number(r.percentage) }));
    },
  });
}

export type CategoryBreakdownRow = NonNullable<ReturnType<typeof useCategoryBreakdown>['data']>[number];

export function useBalance() {
  return useQuery({
    queryKey: queryKeys.balance(),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_balance');
      if (error) throw error;
      return Number(data);
    },
  });
}
