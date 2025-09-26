import { Slot, SplashScreen, Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient, { setupQueryClientPersistence } from '../src/lib/queryClient';
import { useEffect } from 'react';
import { lightTheme, darkTheme } from '../src/theme/theme';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function Layout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  React.useEffect(() => {
    let cleanup: any;
    (async () => {
      cleanup = await setupQueryClientPersistence();
    })();
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SafeAreaProvider>
              {/* Single routing entry point — let expo-router's <Slot /> handle navigation */}
              <Slot />
            </SafeAreaProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
