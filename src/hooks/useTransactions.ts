import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FINANCE_KEY, queryKeys } from '@/lib/queryClient';
import { monthRange } from '@/utils/date';
import type { TransactionInput } from '@/utils/validation';

const SELECT = '*, category:categories(id, name, icon, color)';

export function useTransactions(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.transactions(year, month),
    queryFn: async () => {
      const { start, end } = monthRange(year, month);
      const { data, error } = await supabase
        .from('transactions')
        .select(SELECT)
        .gte('date', start)
        .lt('date', end)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export type TransactionWithCategory = NonNullable<ReturnType<typeof useTransactions>['data']>[number];

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('transactions').select(SELECT).eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });
}

function useInvalidateFinance() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [FINANCE_KEY] });
}

export function useCreateTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    // user_id defaults to auth.uid() in the database.
    mutationFn: async (tx: TransactionInput) => {
      const { data, error } = await supabase.from('transactions').insert(tx).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateTransaction(id: string) {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: async (tx: TransactionInput) => {
      const { data, error } = await supabase.from('transactions').update(tx).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}
