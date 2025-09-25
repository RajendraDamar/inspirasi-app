# Components Instructions for inspirasi-app

## 🎣 React Query Hook for Data Fetching

### **useWeatherData Hook (src/hooks/useWeatherData.ts)**

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';
import bmkgService from '../services/api/bmkgService';
import { useLocation } from './useLocation';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

export const useWeatherData = (locationCode?: string) => {
  const queryClient = useQueryClient();
  const { currentLocation } = useLocation();

  const finalLocationCode = locationCode || currentLocation?.code || '31.71.03.1001';

  // Listen to network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Refetch when coming back online
        queryClient.invalidateQueries({ queryKey: ['weather'] });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  const weatherQuery = useQuery({
    queryKey: ['weather', finalLocationCode],
    queryFn: () => bmkgService.getWeatherByLocation(finalLocationCode),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 3 * 60 * 60 * 1000, // 3 hours (was cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: 'offlineFirst', // Use cache when offline
  });

  return {
    data: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    isError: weatherQuery.isError,
    error: weatherQuery.error,
    refetch: weatherQuery.refetch,
    isStale: weatherQuery.isStale
  };
};
```

---

## 🗺️ Location Hook

### **useLocation Hook (src/hooks/useLocation.ts)**

```typescript
import { useState, useEffect } from 'react';
import locationService from '../services/location/locationService';

interface LocationData {
  latitude: number;
  longitude: number;
  locationCode: string;
  locationName: string;
  accuracy?: number;
}

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');

      // Set default location on error
      setCurrentLocation({
        latitude: -6.2088,
        longitude: 106.8456,
        locationCode: "31.71.03.1001",
        locationName: "Jakarta Pusat"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocations = (searchTerm: string) => {
    return locationService.searchLocationByName(searchTerm);
  };

  useEffect(() => {
    // Try to get cached location first
    const cached = locationService.getCachedLocation();
    if (cached) {
      setCurrentLocation(cached);
    } else {
      // Get fresh location
      getCurrentLocation();
    }
  }, []);

  return {
    currentLocation,
    isLoading,
    error,
    getCurrentLocation,
    searchLocations
  };
};
```

---

## 🏠 Main App Structure

### **Root Layout (app/_layout.tsx)**

```typescript
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { Colors } from '../src/constants/colors';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import performanceService from '../src/services/performance/performanceService';
import notificationService from '../src/services/notifications/notificationService';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    // Load custom fonts if needed
  });

  useEffect(() => {
    if (loaded) {
      // Initialize services
      performanceService.loadMetrics();
      notificationService.initialize();

      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...Colors[colorScheme ?? 'light'],
    // Add Material Design 3 theme customization
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={{ colors: theme }}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ 
              headerShown: true, 
              title: "Settings",
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.onPrimary
            }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
```

---

## 📑 Bottom Tabs Layout

### **Tabs Layout (app/(tabs)/_layout.tsx)**

```typescript
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import Header from '../../src/components/common/Header';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.outline,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
          headerShown: false, // Header is handled globally
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="forecasts"
          options={{
            title: 'Forecasts',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="cloud" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="library-books" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
```

---

## 📊 Forecasts Sub-tabs Layout

### **Forecasts Layout (app/(tabs)/forecasts/_layout.tsx)**

```typescript
import { MaterialTopTabs } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';

const Tab = MaterialTopTabs.Navigator;

export default function ForecastsLayout() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 120 },
      }}
    >
      <Tab.Screen name="index" options={{ title: 'Weather' }} />
      <Tab.Screen name="wind" options={{ title: 'Wind' }} />
      <Tab.Screen name="currents" options={{ title: 'Currents' }} />
      <Tab.Screen name="waves" options={{ title: 'Waves' }} />
      <Tab.Screen name="tides" options={{ title: 'Tides' }} />
    </Tab.Navigator>
  );
}
```

---

## 🎨 Common Components

### **Header Component (src/components/common/Header.tsx)**

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Searchbar, Menu, Avatar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

const Header = () => {
  const theme = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement location search
  };

  const handleMenuAction = (action: string) => {
    closeMenu();
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'login':
        router.push('/(auth)/login');
        break;
      case 'logout':
        logout();
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* App Logo */}
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="Marine Weather" />

        {/* Search Bar */}
        <Searchbar
          placeholder="Search location..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14 }}
        />

        {/* Profile Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon={() => 
                isAuthenticated ? (
                  <Avatar.Text size={32} label={user?.displayName?.[0] || 'U'} />
                ) : (
                  <Avatar.Icon size={32} icon="account" />
                )
              }
              onPress={openMenu}
            />
          }
        >
          {isAuthenticated ? (
            <>
              <Menu.Item onPress={() => handleMenuAction('profile')} title="Profile" />
              <Menu.Item onPress={() => handleMenuAction('settings')} title="Settings" />
              <Menu.Item onPress={() => handleMenuAction('notifications')} title="Notifications" />
              <Menu.Item onPress={() => handleMenuAction('logout')} title="Logout" />
            </>
          ) : (
            <Menu.Item onPress={() => handleMenuAction('login')} title="Login" />
          )}
        </Menu>
      </Appbar.Header>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40, // Status bar height
  },
  searchbar: {
    flex: 1,
    marginHorizontal: 16,
    height: 40,
  },
});

export default Header;
```

---

## 🌤️ Weather Card Component

### **Weather Card (src/components/common/WeatherCard.tsx)**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  lastUpdate: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location,
  humidity,
  windSpeed,
  lastUpdate
}) => {
  const theme = useTheme();

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return 'wb-sunny';
    } else if (lowerCondition.includes('cloud')) {
      return 'cloud';
    } else if (lowerCondition.includes('rain')) {
      return 'beach-access';
    }
    return 'wb-cloudy';
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
              {location}
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Updated: {lastUpdate}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.temperatureSection}>
            <Text variant="displayLarge" style={{ color: theme.colors.onSurface }}>
              {Math.round(temperature)}°
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {condition}
            </Text>
          </View>

          <MaterialIcons 
            name={getWeatherIcon(condition)} 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialIcons name="water-drop" size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium">{humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="air" size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium">{windSpeed} km/h</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureSection: {
    alignItems: 'flex-start',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default WeatherCard;
```

---

## 🚨 Error Boundary Component

### **Error Boundary (src/components/common/ErrorBoundary.tsx)**

```typescript
import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import performanceService from '../../services/performance/performanceService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Log error to performance service
    performanceService.recordError(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearCache = async () => {
    try {
      await AsyncStorage.clear();
      this.handleReset();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Card.Content style={styles.content}>
              <MaterialIcons name="error-outline" size={64} color="#F44336" />

              <Text variant="headlineSmall" style={styles.title}>
                Oops! Something went wrong
              </Text>

              <Text variant="bodyMedium" style={styles.message}>
                The app encountered an unexpected error. You can try restarting or clearing the cache.
              </Text>

              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={this.handleReset} style={styles.button}>
                  Try Again
                </Button>

                <Button mode="outlined" onPress={this.handleClearCache} style={styles.button}>
                  Clear Cache
                </Button>
              </View>

              {__DEV__ && (
                <Text variant="bodySmall" style={styles.errorDetails}>
                  Error: {this.state.error?.message}
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginVertical: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  errorDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default ErrorBoundary;
```
