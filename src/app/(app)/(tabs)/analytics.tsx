import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpendingPieChart } from '@/components/charts/SpendingPieChart';
import { MonthSelector } from '@/components/ui/MonthSelector';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/QueryState';
import { useCurrency } from '@/hooks/useProfile';
import { useCategoryBreakdown, useMonthlySummary } from '@/hooks/useSummary';
import { useUiStore } from '@/store/uiStore';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/currency';

export default function AnalyticsScreen() {
  const year = useUiStore((s) => s.selectedYear);
  const month = useUiStore((s) => s.selectedMonth);
  const currency = useCurrency();
  const breakdown = useCategoryBreakdown(year, month);
  const summary = useMonthlySummary(year, month);
  const rows = breakdown.data ?? [];
  const net = summary.data?.net ?? 0;

  const refresh = () => {
    breakdown.refetch();
    summary.refetch();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={breakdown.isRefetching || summary.isRefetching}
            onRefresh={refresh}
            tintColor={colors.textMuted}
          />
        }
      >
        <Text style={styles.title}>Analytics</Text>
        <MonthSelector />

        <View style={styles.stats}>
          <Stat label="Income" value={formatCurrency(summary.data?.income ?? 0, currency)} color={colors.income} />
          <Stat label="Expenses" value={formatCurrency(summary.data?.expenses ?? 0, currency)} color={colors.expense} />
        </View>
        <Stat
          label="Net"
          value={`${net < 0 ? '−' : ''}${formatCurrency(Math.abs(net), currency)}`}
          color={net < 0 ? colors.expense : colors.income}
        />

        <Text style={styles.section}>Spending by category</Text>
        {breakdown.isLoading ? (
          <LoadingView />
        ) : breakdown.isError ? (
          <ErrorView error={breakdown.error} onRetry={breakdown.refetch} />
        ) : rows.length === 0 ? (
          <EmptyView title="No expenses this month" />
        ) : (
          <>
            <SpendingPieChart
              slices={rows.map((r) => ({ key: r.category_id ?? 'none', value: r.total, color: r.category_color }))}
              centerLabel="Spent"
              centerValue={formatCurrency(summary.data?.expenses ?? 0, currency)}
            />
            <View style={styles.list}>
              {rows.map((r) => (
                <View key={r.category_id ?? 'none'} style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: r.category_color }]} />
                  <Text style={styles.rowIcon}>{r.category_icon}</Text>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {r.category_name}
                  </Text>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowAmount}>{formatCurrency(r.total, currency)}</Text>
                    <Text style={styles.rowPct}>{r.percentage.toFixed(1)}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 12 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14 },
  statLabel: { fontSize: 12, color: colors.textDim, marginBottom: 4 },
  statValue: { fontSize: 17, fontWeight: '800' },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 16 },
  list: { marginTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  rowIcon: { fontSize: 18, marginRight: 8 },
  rowName: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '600' },
  rowRight: { alignItems: 'flex-end' },
  rowAmount: { fontSize: 14, fontWeight: '700', color: colors.text },
  rowPct: { fontSize: 12, color: colors.textDim },
});
