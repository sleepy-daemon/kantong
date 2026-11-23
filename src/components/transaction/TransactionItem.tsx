import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

interface Props {
  type: string;
  amount: number;
  description: string | null;
  date: string;
  category: { name: string; icon: string | null; color: string | null } | null;
  currency: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const TransactionItem = memo(function TransactionItem({
  type,
  amount,
  description,
  date,
  category,
  currency,
  onPress,
  onLongPress,
}: Props) {
  const isExpense = type === 'expense';
  const tint = category?.color ?? colors.textDim;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${category?.name ?? 'Uncategorized'}, ${isExpense ? 'expense' : 'income'} ${formatCurrency(amount, currency)}, ${formatDate(date)}`}
    >
      <View style={[styles.iconWrap, { backgroundColor: tint + '22' }]}>
        <Text style={styles.icon}>{category?.icon ?? '📦'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {category?.name ?? 'Uncategorized'}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {description ? `${description} · ${formatDate(date)}` : formatDate(date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isExpense ? colors.expense : colors.income }]}>
        {isExpense ? '−' : '+'}
        {formatCurrency(amount, currency)}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 20 },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  desc: { fontSize: 12, color: colors.textDim },
  amount: { fontSize: 15, fontWeight: '700' },
});
