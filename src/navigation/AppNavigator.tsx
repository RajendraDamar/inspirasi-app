import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';
// Safe dynamic imports for Searchbar/useTheme to avoid named-export mismatches between versions
let Searchbar: any;
let useTheme: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rp = require('react-native-paper');
  Searchbar = rp.Searchbar || rp.default?.Searchbar || rp.default || ((props: any) => null);
  useTheme = rp.useTheme || (() => rp.default?.useTheme?.() || { colors: { primary: '#4285F4' } });
} catch (e) {
  Searchbar = (props: any) => null;
  useTheme = () => ({ colors: { primary: '#4285F4' } });
}
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AuthScreen from '../screens/AuthScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../components/common/BottomNav';

const Tab = createBottomTabNavigator();
// Workaround: some TS environments have strict JSX types for Navigator props.
// Expose a loosely-typed Navigator to avoid complex generic mismatches in this scaffold.
const TabNavigator: any = Tab.Navigator;

function TopAppbar() {
  const [query, setQuery] = useState('');
  const theme = useTheme();

  return (
    <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Content title="Inspirasi" subtitle="Marine Weather" />
      <View style={{ flex: 1, alignItems: 'center' }}>
        {Searchbar ? (
          <Searchbar
            placeholder="Cari aplikasi, laporan..."
            value={query}
            onChangeText={setQuery}
            style={{ width: '90%', maxWidth: 420 }}
          />
        ) : null}
      </View>
      <Appbar.Action icon="magnify" onPress={() => {}} />
    </Appbar.Header>
  );
}

const Placeholder = ({ route }: any) => (
  <View style={styles.center}>
    <Appbar.Content title={route.name} />
  </View>
);

function MainTabs({ initialRouteName }: { initialRouteName: string }) {
  const theme = useTheme();
  return (
    <TabNavigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#6b6b6b',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }: any) => {
          const name = route.name === 'Home' ? 'home' : route.name === 'Reports' ? 'file-document' : route.name === 'Library' ? 'apps' : 'cog';
          return <MaterialCommunityIcons name={name as string} size={28 as number} color={color} />;
        },
      })}
      tabBar={(props: any) => <BottomNav {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Laporan' }} />
      <Tab.Screen name="Library" component={Placeholder} options={{ title: 'Perpustakaan' }} />
      <Tab.Screen name="Settings" component={Placeholder} options={{ title: 'Akun' }} />
    </TabNavigator>
  );
}

export default function AppNavigator({ initialRouteName, forceAuth }: { initialRouteName?: string; forceAuth?: boolean } = {}) {
  // Allow E2E forcing via props or query param
  let forced: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      forced = params.get('e2e');
    }
  } catch (e) {
    forced = null;
  }

  if (forceAuth || forced === 'auth') return <AuthScreen />;

  // If E2E forcing is present, render the forced screen directly to
  // provide a simple, predictable DOM for external browser verification tools.
  if (forced === 'reports') {
    return (
      <View style={styles.container}>
        <TopAppbar />
        <ReportsScreen />
      </View>
    );
  }

  if (forced === 'home') {
    return (
      <View style={styles.container}>
        <TopAppbar />
        <HomeScreen />
      </View>
    );
  }

  const initial = initialRouteName || 'Home';

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Content title="Inspirasi" subtitle="Marine Weather" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <MainTabs initialRouteName={initial} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
