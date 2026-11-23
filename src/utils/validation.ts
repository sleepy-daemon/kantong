import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .number({ error: 'Enter a valid amount' })
    .refine(Number.isFinite, 'Enter a valid amount')
    .positive('Amount must be greater than zero')
    .max(9_999_999_999_999, 'Amount is too large'),
  category_id: z.uuid({ error: 'Select a category' }),
  description: z.string().trim().max(200, 'Note must be 200 characters or fewer').nullable(),
  date: z.iso.date({ error: 'Enter a valid date' }),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
