import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface Props {
  balance: number;
  income: number;
  expenses: number;
  currency: string;
}

export function BalanceCard({ balance, income, expenses, currency }: Props) {
  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.balance} adjustsFontSizeToFit numberOfLines={1}>
        {formatCurrency(balance, currency)}
      </Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>↑ Income this month</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {formatCurrency(income, currency)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>↓ Expenses this month</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {formatCurrency(expenses, currency)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: 22, marginBottom: 20 },
  label: { fontSize: 13, color: '#dbeafe', marginBottom: 6 },
  balance: { fontSize: 30, fontWeight: '800', color: '#fff', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1 },
  statLabel: { fontSize: 12, color: '#c7d2fe', marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: '700', color: '#fff' },
  divider: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 14 },
});
