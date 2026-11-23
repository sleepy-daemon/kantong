import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { TransactionItem } from '@/components/transaction/TransactionItem';
import { Fab } from '@/components/ui/Fab';
import { MonthSelector } from '@/components/ui/MonthSelector';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/QueryState';
import { useCurrency } from '@/hooks/useProfile';
import { useBalance, useMonthlySummary } from '@/hooks/useSummary';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { colors } from '@/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const firstName = useAuthStore((s) => s.user?.user_metadata?.full_name?.split(' ')[0] as string | undefined);
  const year = useUiStore((s) => s.selectedYear);
  const month = useUiStore((s) => s.selectedMonth);
  const currency = useCurrency();

  const tx = useTransactions(year, month);
  const summary = useMonthlySummary(year, month);
  const balance = useBalance();
  const recent = (tx.data ?? []).slice(0, 5);

  const refreshing = tx.isRefetching || summary.isRefetching || balance.isRefetching;
  const refresh = () => {
    tx.refetch();
    summary.refetch();
    balance.refetch();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.textMuted} />}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>Hi{firstName ? `, ${firstName}` : ''} 👋</Text>
            <BalanceCard
              balance={balance.data ?? 0}
              income={summary.data?.income ?? 0}
              expenses={summary.data?.expenses ?? 0}
              currency={currency}
            />
            <MonthSelector />
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Recent</Text>
              {recent.length > 0 && (
                <TouchableOpacity onPress={() => router.navigate('/transactions')}>
                  <Text style={styles.link}>See all</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          tx.isLoading ? (
            <LoadingView />
          ) : tx.isError ? (
            <ErrorView error={tx.error} onRetry={tx.refetch} />
          ) : (
            <EmptyView title="No transactions this month" message="Tap + to add your first one." />
          )
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
          />
        )}
      />
      <Fab label="Add transaction" onPress={() => router.push('/modals/add-transaction')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 100 },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text },
  link: { fontSize: 13, fontWeight: '600', color: colors.primary },
});
