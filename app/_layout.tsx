import { Slot, SplashScreen, Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme } from '../src/constants/theme';
import { AuthProvider } from '../src/contexts/AuthContext';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={lightTheme}>
            <AuthProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="reports" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
              </Stack>
              <Slot />
            </AuthProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
