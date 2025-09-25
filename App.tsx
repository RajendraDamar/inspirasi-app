import React, { useEffect } from 'react';
// use dynamic import for expo-status-bar to avoid type resolution issues in this scaffold
let StatusBar: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  StatusBar = require('expo-status-bar').StatusBar;
} catch (e) {
  StatusBar = () => null;
}
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme } from './src/constants/theme';
// Try to use expo-router's ExpoRoot for routing on web/native if available
let ExpoRoot: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoRoot = require('expo-router').ExpoRoot;
} catch (e) {
  ExpoRoot = null;
}
import AppNavigator from './src/navigation/AppNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import AuthContext from './src/contexts/AuthContext';
import dataSyncManager from './src/services/sync/dataSyncManager';
import ReportsScreen from './src/screens/ReportsScreen';
import pushNotifications from './src/services/notifications/pushNotifications';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    dataSyncManager.initialize().catch(() => {});
    return () => {
      try { dataSyncManager.cleanup(); } catch (_) {}
    };
  }, []);
  // Compute E2E forced route from URL if available
  let forced: string | null = null;
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      forced = params.get('e2e');
    }
  } catch (e) { forced = null; }

  const AppContent = () => {
    // When AuthProvider wraps this, use Context to decide
    if (forced === 'auth') return <AuthScreen />;
    if (forced === 'reports') return <ReportsScreen />;
    if (forced === 'home') return <HomeScreen />;

    const ctx = React.useContext(AuthContext);
    if (!ctx) return null; // provider not mounted yet
    const { user, loading } = ctx;
    if (loading) return null;
    if (!user) return <AuthScreen />;
    // If expo-router is available, prefer it for file-based routing.
    if (ExpoRoot) return <ExpoRoot />;

    // Fallback: use the internal AppNavigator (React Navigation) only when Expo Router
    // is not available. This keeps a single routing flow for the app while allowing
    // the repo to move fully to Expo Router when desired.
    return <AppNavigator initialRouteName={'Home'} forceAuth={false} />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={lightTheme}>
          <AuthProvider>
            <StatusBar style={'auto'} />
            <AppContent />
          </AuthProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
