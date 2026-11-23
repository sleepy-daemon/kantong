import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

// Every query derived from transactions lives under this prefix, so one
// invalidation after a write refreshes lists, summary, breakdown and balance.
export const FINANCE_KEY = 'finance';

export const queryKeys = {
  transactions: (year: number, month: number) => [FINANCE_KEY, 'transactions', year, month] as const,
  transaction: (id: string) => [FINANCE_KEY, 'transaction', id] as const,
  summary: (year: number, month: number) => [FINANCE_KEY, 'summary', year, month] as const,
  breakdown: (year: number, month: number) => [FINANCE_KEY, 'breakdown', year, month] as const,
  balance: () => [FINANCE_KEY, 'balance'] as const,
  categories: (type?: string) => ['categories', type ?? 'all'] as const,
  profile: (userId: string) => ['profile', userId] as const,
};
