import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';

export default function LoginScreen() {
  const { signInWithGoogle, loading, error } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logoEmoji}>👛</Text>
        <Text style={styles.appName}>Kantong</Text>
        <Text style={styles.tagline}>Your pocket, tracked.</Text>
        <TouchableOpacity
          style={[styles.googleBtn, loading && styles.disabled]}
          onPress={signInWithGoogle}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="google" size={20} color="#fff" />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logoEmoji: { fontSize: 64, marginBottom: 12 },
  appName: { fontSize: 36, fontWeight: '800', color: colors.text, marginBottom: 8 },
  tagline: { fontSize: 16, color: colors.textDim, marginBottom: 60 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primaryDark,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    minHeight: 56,
  },
  disabled: { opacity: 0.7 },
  googleText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  error: { marginTop: 16, color: colors.expense, textAlign: 'center' },
});
