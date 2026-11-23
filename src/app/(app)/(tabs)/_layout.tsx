import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function icon(name: IconName) {
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    // Tab tint colors are plain strings (see screenOptions below).
    return <MaterialCommunityIcons name={name} color={typeof color === 'string' ? color : undefined} size={size} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: icon('view-dashboard') }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions', tabBarIcon: icon('swap-horizontal') }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics', tabBarIcon: icon('chart-donut') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('account') }} />
    </Tabs>
  );
}
