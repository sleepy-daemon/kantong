import { Alert } from 'react-native';
import { useDeleteTransaction } from './useTransactions';
import { errorMessage } from '@/utils/errors';

/** Returns a function that asks for confirmation, then deletes the transaction. */
export function useConfirmDelete(onDeleted?: () => void) {
  const { mutateAsync } = useDeleteTransaction();
  return (id: string) =>
    Alert.alert('Delete transaction?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await mutateAsync(id);
            onDeleted?.();
          } catch (e) {
            Alert.alert('Could not delete', errorMessage(e));
          }
        },
      },
    ]);
}
