import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TransactionForm } from '@/components/transaction/TransactionForm';
import { ErrorView, LoadingView } from '@/components/ui/QueryState';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { colors } from '@/theme';

export default function EditTransactionModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useTransaction(id);
  const { mutateAsync } = useUpdateTransaction(id);
  const confirmDelete = useConfirmDelete(() => router.back());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {isLoading ? (
        <LoadingView />
      ) : isError || !data ? (
        <ErrorView error={error} onRetry={refetch} />
      ) : (
        <TransactionForm
          title="Edit transaction"
          submitLabel="Save changes"
          initial={{
            type: data.type === 'income' ? 'income' : 'expense',
            amount: data.amount,
            category_id: data.category_id ?? '',
            description: data.description,
            date: data.date,
          }}
          onCancel={() => router.back()}
          onDelete={() => confirmDelete(id)}
          onSubmit={async (tx) => {
            await mutateAsync(tx);
            router.back();
          }}
        />
      )}
    </SafeAreaView>
  );
}
