import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCategories } from '@/hooks/useCategories';
import { colors } from '@/theme';

interface Props {
  type: 'income' | 'expense';
  selected: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ type, selected, onSelect }: Props) {
  const { data: categories = [], isLoading, isError } = useCategories(type);

  if (isLoading) return <ActivityIndicator color={colors.primary} style={styles.status} />;
  if (isError) return <Text style={styles.error}>Couldn&apos;t load categories.</Text>;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((cat) => {
        const active = selected === cat.id;
        const tint = cat.color ?? colors.primary;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, active && { borderColor: tint, backgroundColor: tint + '22' }]}
            onPress={() => onSelect(cat.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.label, active && { color: tint }]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  icon: { fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  status: { paddingVertical: 12 },
  error: { color: colors.expense, paddingVertical: 12 },
});
