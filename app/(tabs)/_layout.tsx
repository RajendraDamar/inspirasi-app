import React, { useMemo } from 'react';
import { Slot, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  const routes = useMemo(
    () => [
      { key: 'home', title: 'Home', route: '/(tabs)/index' },
      { key: 'forecasts', title: 'Forecasts', route: '/(tabs)/forecasts' },
      { key: 'library', title: 'Library', route: '/(tabs)/library' },
    ],
    []
  );

  const [index, setIndex] = React.useState(0);

  // Avoid trying to navigate during the initial mount before the root
  // layout is fully mounted. Track initial mount and only run navigation
  // when `index` changes after mount.
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    // When index changes after mount, navigate to the route
    const r = routes[index];
    if (r) router.replace(r.route);
  }, [index, router, routes]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <View style={styles.tabBar}>
        {routes.map((r, i) => (
          <Pressable
            key={r.key}
            onPress={() => setIndex(i)}
            style={styles.tabButton}
            accessibilityRole="button"
          >
            <Text style={i === index ? styles.activeText : styles.inactiveText}>{r.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 56,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#333',
  },
});
