import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { CategoryPicker } from './CategoryPicker';
import { colors } from '@/theme';
import { parseAmountInput } from '@/utils/currency';
import { formatDate, todayISO } from '@/utils/date';
import { errorMessage } from '@/utils/errors';
import { transactionSchema, type TransactionInput } from '@/utils/validation';

interface Props {
  title: string;
  initial?: TransactionInput;
  submitLabel: string;
  onSubmit: (tx: TransactionInput) => Promise<unknown>;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TransactionForm({ title, initial, submitLabel, onSubmit, onCancel, onDelete }: Props) {
  const [type, setType] = useState<'income' | 'expense'>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [categoryId, setCategoryId] = useState<string | null>(initial?.category_id ?? null);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function switchType(next: 'income' | 'expense') {
    if (next === type) return;
    setType(next);
    setCategoryId(null); // categories differ per type
  }

  function pickDate(picked: Date) {
    setDate(format(picked, 'yyyy-MM-dd'));
  }

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: parseISO(date),
      mode: 'date',
      onChange: (event: DateTimePickerEvent, picked?: Date) => {
        if (event.type === 'set' && picked) pickDate(picked);
      },
    });
  }

  async function handleSubmit() {
    const parsed = transactionSchema.safeParse({
      type,
      amount: parseAmountInput(amount),
      category_id: categoryId ?? '',
      description: description.trim() || null,
      date,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check the form and try again.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit(parsed.data);
    } catch (e) {
      setError(errorMessage(e, 'Could not save. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  const isFuture = date > todayISO();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} hitSlop={12} accessibilityLabel="Close">
          <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {onDelete ? (
          <TouchableOpacity onPress={onDelete} hitSlop={12} accessibilityLabel="Delete transaction">
            <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.expense} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.segment}>
          {(['expense', 'income'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.segmentBtn, type === t && { backgroundColor: t === 'expense' ? colors.expense : colors.income }]}
              onPress={() => switchType(t)}
              accessibilityRole="button"
              accessibilityState={{ selected: type === t }}
            >
              <Text style={[styles.segmentText, type === t && styles.segmentTextActive]}>
                {t === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textDim}
          autoFocus={!initial}
          accessibilityLabel="Amount"
        />

        <Text style={styles.label}>Category</Text>
        <CategoryPicker type={type} selected={categoryId} onSelect={setCategoryId} />

        <Text style={styles.label}>Date</Text>
        <View style={styles.dateRow}>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={parseISO(date)}
              mode="date"
              display="compact"
              themeVariant="dark"
              onChange={(_event: DateTimePickerEvent, picked?: Date) => picked && pickDate(picked)}
            />
          ) : (
            <TouchableOpacity style={styles.dateBtn} onPress={openAndroidPicker} accessibilityLabel="Change date">
              <MaterialCommunityIcons name="calendar" size={18} color={colors.textMuted} />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
          )}
          {date !== todayISO() && (
            <TouchableOpacity onPress={() => setDate(todayISO())} style={styles.todayBtn}>
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>
          )}
        </View>
        {isFuture && <Text style={styles.hint}>This date is in the future.</Text>}

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Lunch with team"
          placeholderTextColor={colors.textDim}
          maxLength={200}
          accessibilityLabel="Note"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={[styles.submit, saving && styles.disabled]} onPress={handleSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{submitLabel}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  iconSpacer: { width: 24 },
  body: { padding: 20, paddingTop: 4 },
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  segmentText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: '#fff' },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 22, marginBottom: 8 },
  amountInput: { fontSize: 34, fontWeight: '800', color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8 },
  input: { fontSize: 15, color: colors.text, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10 },
  dateText: { fontSize: 15, fontWeight: '600', color: colors.text },
  todayBtn: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  todayText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  hint: { fontSize: 12, color: colors.textDim, marginTop: 6 },
  error: { color: colors.expense, marginTop: 18, fontSize: 14 },
  submit: { marginTop: 28, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
