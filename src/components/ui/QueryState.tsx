import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme';
import { errorMessage } from '@/utils/errors';

export function LoadingView() {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export function ErrorView({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Couldn&apos;t load data</Text>
      <Text style={styles.message}>{errorMessage(error)}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} accessibilityRole="button">
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function EmptyView({ title, message }: { title: string; message?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 6, textAlign: 'center' },
  message: { fontSize: 13, color: colors.textDim, textAlign: 'center' },
  button: { marginTop: 14, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  buttonText: { color: colors.primary, fontWeight: '600' },
});
