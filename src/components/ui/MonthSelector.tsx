import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '@/store/uiStore';
import { colors } from '@/theme';
import { formatMonth } from '@/utils/date';

export function MonthSelector() {
  const selectedYear = useUiStore((s) => s.selectedYear);
  const selectedMonth = useUiStore((s) => s.selectedMonth);
  const goToPrevMonth = useUiStore((s) => s.goToPrevMonth);
  const goToNextMonth = useUiStore((s) => s.goToNextMonth);
  const goToCurrentMonth = useUiStore((s) => s.goToCurrentMonth);

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={goToPrevMonth} hitSlop={12} accessibilityLabel="Previous month">
        <MaterialCommunityIcons name="chevron-left" size={26} color={colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity onLongPress={goToCurrentMonth} accessibilityHint="Long press to jump to this month">
        <Text style={styles.label}>{formatMonth(selectedYear, selectedMonth)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToNextMonth} hitSlop={12} accessibilityLabel="Next month">
        <MaterialCommunityIcons name="chevron-right" size={26} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 150, textAlign: 'center' },
});
