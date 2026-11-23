import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queryClient';

export function useCategories(type?: 'income' | 'expense') {
  return useQuery({
    queryKey: queryKeys.categories(type),
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('is_system', { ascending: false })
        .order('name', { ascending: true });
      if (type) query = query.in('type', [type, 'both']);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
}
