import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TransactionItem } from '@/components/transaction/TransactionItem';
import { Fab } from '@/components/ui/Fab';
import { MonthSelector } from '@/components/ui/MonthSelector';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/QueryState';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useCurrency } from '@/hooks/useProfile';
import { useTransactions } from '@/hooks/useTransactions';
import { useUiStore } from '@/store/uiStore';
import { colors } from '@/theme';

type Filter = 'all' | 'income' | 'expense';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const year = useUiStore((s) => s.selectedYear);
  const month = useUiStore((s) => s.selectedMonth);
  const currency = useCurrency();
  const { data = [], isLoading, isError, error, refetch, isRefetching } = useTransactions(year, month);
  const confirmDelete = useConfirmDelete();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter(
      (t) =>
        (filter === 'all' || t.type === filter) &&
        (!q || t.description?.toLowerCase().includes(q) || t.category?.name.toLowerCase().includes(q)),
    );
  }, [data, filter, search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <MonthSelector />
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search notes or categories"
          placeholderTextColor={colors.textDim}
          clearButtonMode="while-editing"
          accessibilityLabel="Search transactions"
        />
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              onPress={() => setFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f.key }}
            >
              <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.textMuted} />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingView />
          ) : isError ? (
            <ErrorView error={error} onRetry={refetch} />
          ) : (
            <EmptyView
              title={data.length ? 'No matches' : 'No transactions this month'}
              message={data.length ? 'Try a different search or filter.' : 'Tap + to add one.'}
            />
          )
        }
        ListFooterComponent={
          visible.length > 0 ? <Text style={styles.hint}>Long-press a transaction to delete it.</Text> : undefined
        }
        renderItem={({ item }) => (
          <TransactionItem
            type={item.type}
            amount={item.amount}
            description={item.description}
            date={item.date}
            category={item.category}
            currency={currency}
            onPress={() => router.push({ pathname: '/modals/transaction/[id]', params: { id: item.id } })}
            onLongPress={() => confirmDelete(item.id)}
          />
        )}
      />
      <Fab label="Add transaction" onPress={() => router.push('/modals/add-transaction')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 12 },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  chips: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  hint: { textAlign: 'center', color: colors.textDim, fontSize: 12, marginTop: 8 },
});
