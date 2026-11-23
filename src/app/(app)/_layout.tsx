import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modals/add-transaction" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="modals/transaction/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
