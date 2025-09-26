import React from 'react';
import { Slot, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import { LocationProvider } from '../../src/contexts/LocationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../src/theme/colors';
import spacing from '../../src/theme/spacing';

export default function TabsLayout() {
  const router = useRouter();

  const tabs = [
    { name: 'index', title: 'Beranda', route: '/(tabs)/index', key: 'beranda' },
    { name: 'forecasts', title: 'Prakiraan', route: '/(tabs)/forecasts', key: 'prakiraan' },
    { name: 'alerts', title: 'Peringatan', route: '/(tabs)/alerts', key: 'peringatan' },
    { name: 'reports', title: 'Laporan', route: '/(tabs)/reports', key: 'laporan' }
  ];

  const [index, setIndex] = React.useState(0);
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const r = tabs[index];
    if (r) router.replace(r.route);
  }, [index, router, tabs]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LocationProvider>
        <AppHeader showSearch />
        <Slot />
      </LocationProvider>

      <View style={styles.tabBar}>
        {tabs.map((t, i) => {
          const active = i === index;
          const activeColor = t.key === 'peringatan' ? colors.critical : colors.primary;
          const iconName = t.key === 'beranda' ? 'home' : t.key === 'prakiraan' ? 'weather-partly-cloudy' : t.key === 'peringatan' ? 'alert' : 'clipboard-text';
          return (
            <Pressable key={t.key} onPress={() => setIndex(i)} style={styles.tabButton} accessibilityRole="button">
              <View style={{ alignItems: 'center' }}>
                <MaterialCommunityIcons name={iconName as any} size={24} color={active ? activeColor : '#49454F'} />
                <Text style={[styles.label, { color: active ? activeColor : '#49454F' }]}>{t.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 24
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4
  }
});
