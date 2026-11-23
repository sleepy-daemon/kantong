import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TransactionForm } from '@/components/transaction/TransactionForm';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { colors } from '@/theme';

export default function AddTransactionModal() {
  const router = useRouter();
  const { mutateAsync } = useCreateTransaction();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TransactionForm
        title="Add transaction"
        submitLabel="Save"
        onCancel={() => router.back()}
        onSubmit={async (tx) => {
          await mutateAsync(tx);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
