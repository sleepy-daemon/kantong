import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateCurrency } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';
import { errorMessage } from '@/utils/errors';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const updateCurrency = useUpdateCurrency();
  const { signOut } = useAuth();

  const name = profile?.full_name ?? (user?.user_metadata?.full_name as string | undefined) ?? 'Kantong user';
  const avatar = profile?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined);
  const currency = profile?.currency ?? 'IDR';

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You can sign back in with Google anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => signOut().catch((e: unknown) => Alert.alert('Could not sign out', errorMessage(e))),
      },
    ]);
  }

  function chooseCurrency(next: string) {
    if (next === currency) return;
    updateCurrency.mutate(next, {
      onError: (e) => Alert.alert('Could not update currency', errorMessage(e)),
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} accessibilityIgnoresInvertColors />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.name}>{name}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>

        <Text style={styles.section}>Currency</Text>
        <View style={styles.chips}>
          {SUPPORTED_CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, c === currency && styles.chipActive]}
              onPress={() => chooseCurrency(c)}
              disabled={updateCurrency.isPending}
              accessibilityRole="button"
              accessibilityState={{ selected: c === currency }}
            >
              <Text style={[styles.chipText, c === currency && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>Changes how amounts are displayed. Stored amounts are not converted.</Text>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>App version</Text>
          <Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '—'}</Text>
        </View>

        <TouchableOpacity style={styles.signOut} onPress={confirmSignOut} accessibilityRole="button">
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarFallback: { backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 19, fontWeight: '800', color: colors.text },
  email: { fontSize: 13, color: colors.textDim, marginTop: 4 },
  section: { fontSize: 14, fontWeight: '700', color: colors.textMuted, marginTop: 28, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  hint: { fontSize: 12, color: colors.textDim, marginTop: 8 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  rowLabel: { fontSize: 14, color: colors.text },
  rowValue: { fontSize: 14, color: colors.textDim },
  signOut: { marginTop: 32, paddingVertical: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.expense, alignItems: 'center' },
  signOutText: { color: colors.expense, fontSize: 15, fontWeight: '700' },
});
