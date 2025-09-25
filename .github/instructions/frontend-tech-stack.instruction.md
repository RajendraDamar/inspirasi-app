# 🚀 Frontend Tech Stack Implementation Guide 2025
## Indonesian Marine Weather App - Complete Development Approach

---

## 📋 Tech Stack Analysis

Based on our instruction files and 2025 best practices, here's our complete frontend technology stack:

### **Core Framework**
- **Expo SDK 51+** with TypeScript
- **React Native 0.74+** 
- **Expo Router 4.0+** (file-based routing)
- **React Native Paper 5.0+** (Material Design 3)

### **State Management & Data Fetching**
- **TanStack React Query v5** (server state management)
- **React Context API** (auth state)
- **AsyncStorage** (offline persistence)

### **Backend Services**
- **Firebase v10+** (auth, firestore, storage, messaging)
- **BMKG API** (Indonesian weather data)

### **Developer Tools**
- **TypeScript 5.0+** (type safety)
- **Expo Dev Tools** (debugging)

---

## 🎯 Implementation Strategy (2025 Best Practices)

### **Phase 1: Project Setup & Configuration**

#### **1. Create New Expo Project**
```bash
# Use latest Expo template with TypeScript
npx create-expo-app@latest marine-weather-app --template expo-template-blank-typescript

cd marine-weather-app

# Install Expo Router (file-based routing)
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Setup Expo Router in app.json
```

#### **2. Configure app.json for Expo Router**
```json
{
  "expo": {
    "name": "Marine Weather Alert",
    "slug": "marine-weather-alert",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "scheme": "marine-weather-alert",
    "platforms": ["android", "ios", "web"],
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### **3. Project Structure (Expo Router File-Based)**
```
/app
  /_layout.tsx              # Root layout
  /(tabs)
    /_layout.tsx            # Bottom tabs
    /index.tsx              # Home screen  
    /forecasts
      /_layout.tsx          # 5-tab layout
      /index.tsx            # Weather tab
      /wind.tsx
      /currents.tsx  
      /waves.tsx
      /tides.tsx
    /library.tsx            # Reports library
  /(auth)
    /login.tsx
    /register.tsx
  /settings.tsx
  /+not-found.tsx

/src
  /components              # Reusable components
  /services               # API services
  /hooks                 # Custom hooks
  /constants            # App constants
  /types               # TypeScript types
```

---

### **Phase 2: Essential Dependencies Installation**

#### **Install Core Dependencies (No Version Lock)**
```bash
# UI Framework
npx expo install react-native-paper react-native-vector-icons

# State Management & Data Fetching  
npm install @tanstack/react-query

# Storage & Networking
npx expo install @react-native-async-storage/async-storage @react-native-community/netinfo

# Firebase
npm install firebase

# Location & Notifications
npx expo install expo-location expo-notifications expo-device

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Development
npm install --save-dev @types/react @types/react-native typescript
```

---

### **Phase 3: TypeScript Configuration (2025 Standards)**

#### **tsconfig.json (Strict Configuration)**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "es2017"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/services/*": ["src/services/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

#### **Type-First Development Approach**
```typescript
// src/types/weather.ts
export interface WeatherData {
  location: {
    village: string;
    district: string; 
    city: string;
    province: string;
  };
  forecasts: WeatherForecast[];
  marine?: MarineConditions;
}

export interface WeatherForecast {
  datetime: string;
  temperature: number;
  humidity: number;
  weather: string;
  windSpeed: number;
  windDirection: string;
}

// src/types/auth.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: 'fisherman' | 'general';
  location?: UserLocation;
}
```

---

### **Phase 4: Expo Router Navigation Implementation**

#### **Root Layout (app/_layout.tsx)**
```typescript
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../src/contexts/AuthContext';
import ErrorBoundary from '../src/components/ErrorBoundary';

// Create query client with 2025 optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes (formerly cacheTime)
      retry: 3,
      networkMode: 'offlineFirst',      // 2025 offline-first approach
    },
  },
});

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#E3F2FD',
    secondary: '#03DAC6',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="settings" options={{ headerShown: true }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </AuthProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

#### **Bottom Tabs Layout (app/(tabs)/_layout.tsx)**
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
          headerShown: false,
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

### **Phase 5: TanStack React Query v5 Implementation**

#### **Custom Weather Data Hook (2025 Best Practices)**
```typescript
// src/hooks/useWeatherData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNetInfo } from '@react-native-community/netinfo';
import bmkgService from '../services/api/bmkgService';
import type { WeatherData } from '../types/weather';

export const useWeatherData = (locationCode?: string) => {
  const queryClient = useQueryClient();
  const netInfo = useNetInfo();

  const finalLocationCode = locationCode || '31.71.03.1001'; // Jakarta default

  return useQuery({
    queryKey: ['weather', finalLocationCode],
    queryFn: () => bmkgService.getWeatherByLocation(finalLocationCode),

    // v5 optimizations
    staleTime: 30 * 60 * 1000,          // 30 minutes
    gcTime: 3 * 60 * 60 * 1000,         // 3 hours (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // 2025 offline-first approach
    networkMode: 'offlineFirst',

    // Refetch on network reconnect
    refetchOnReconnect: netInfo.isConnected,

    // Type safety with v5
    select: (data: any): WeatherData => ({
      location: data.lokasi,
      forecasts: data.data || [],
      marine: data.marine || null
    }),
  });
};
```

#### **Optimistic Updates for Reports (2025 Pattern)**
```typescript
// src/hooks/useReportMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Report, CreateReportData } from '../types/reports';

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,

    // Optimistic updates (2025 UX best practice)
    onMutate: async (newReport: CreateReportData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['reports'] });

      // Snapshot previous value
      const previousReports = queryClient.getQueryData(['reports']);

      // Optimistically update
      queryClient.setQueryData(['reports'], (old: Report[] = []) => [
        ...old,
        { ...newReport, id: Date.now().toString(), timestamp: new Date() }
      ]);

      return { previousReports };
    },

    onError: (_err, _newReport, context) => {
      // Rollback on error
      queryClient.setQueryData(['reports'], context?.previousReports);
    },

    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
```

---

### **Phase 6: Firebase v10 Integration (2025 Standards)**

#### **Firebase Configuration (src/services/firebase/config.ts)**
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "inspirasi-1.firebaseapp.com", 
  projectId: "inspirasi-1",
  storageBucket: "inspirasi-1.firebasestorage.app",
  messagingSenderId: "1071267678705",
  appId: "1:1071267678705:web:b8802b06621080b4071c50"
};

// Initialize Firebase (avoiding duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence (2025 best practice)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore with offline persistence
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true // Better Android compatibility
});

export const storage = getStorage(app);

export default app;
```

#### **Authentication Hook (TypeScript + 2025 Patterns)**
```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import type { User } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'User',
          userType: 'general' // Default, can be updated from Firestore
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore here
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, signIn, signUp, isAuthenticated: !!user };
};
```

---

### **Phase 7: React Native Paper 5.0 + Material Design 3**

#### **Component Implementation (2025 MD3 Standards)**
```typescript
// src/components/weather/WeatherCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import type { WeatherForecast } from '../../types/weather';

interface WeatherCardProps {
  forecast: WeatherForecast;
  location: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ forecast, location }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MaterialIcons 
              name="location-on" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
              {location}
            </Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.temperatureSection}>
            <Text 
              variant="displayLarge" 
              style={{ color: theme.colors.onSurface }}
            >
              {Math.round(forecast.temperature)}°
            </Text>
            <Text 
              variant="titleMedium" 
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {forecast.weather}
            </Text>
          </View>

          <MaterialIcons 
            name="wb-sunny" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialIcons 
              name="water-drop" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text variant="bodyMedium">{forecast.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons 
              name="air" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text variant="bodyMedium">{forecast.windSpeed} km/h</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2, // Material Design 3 elevation
  },
  header: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    borderTopColor: 'rgba(0,0,0,0.12)',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
```

---

### **Phase 8: Offline-First Architecture with AsyncStorage**

#### **Offline-First Service (2025 Approach)**
```typescript
// src/services/api/bmkgService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { WeatherData } from '../../types/weather';

class BMKGService {
  private baseURL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
  private cacheKeyPrefix = '@weather_cache_';
  private cacheExpiry = 3 * 60 * 60 * 1000; // 3 hours

  async getWeatherByLocation(locationCode: string): Promise<WeatherData> {
    const cacheKey = `${this.cacheKeyPrefix}${locationCode}`;

    try {
      // Check network connectivity first
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        // Online: Fetch fresh data
        const response = await fetch(`${this.baseURL}?adm4=${locationCode}`, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MarineWeatherApp/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`BMKG API Error: ${response.status}`);
        }

        const data = await response.json();
        const processedData = this.processWeatherData(data);

        // Cache fresh data (2025 pattern: cache success results)
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          data: processedData,
          timestamp: Date.now()
        }));

        return processedData;
      } else {
        // Offline: Get cached data
        const cachedData = await this.getCachedWeather(locationCode);
        if (cachedData) {
          return cachedData;
        }
        throw new Error('No internet connection and no cached data available');
      }
    } catch (error) {
      // Fallback to cache if API fails (resilience pattern)
      const cachedData = await this.getCachedWeather(locationCode);
      if (cachedData) {
        return cachedData;
      }
      throw error;
    }
  }

  private async getCachedWeather(locationCode: string): Promise<WeatherData | null> {
    try {
      const cacheKey = `${this.cacheKeyPrefix}${locationCode}`;
      const cachedString = await AsyncStorage.getItem(cacheKey);

      if (cachedString) {
        const cached = JSON.parse(cachedString);
        const isExpired = Date.now() - cached.timestamp > this.cacheExpiry;

        if (!isExpired || !__DEV__) { // In production, show stale data
          return cached.data;
        }
      }
      return null;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  private processWeatherData(rawData: any): WeatherData {
    return {
      location: {
        village: rawData.lokasi?.desa || '',
        district: rawData.lokasi?.kecamatan || '',
        city: rawData.lokasi?.kota || '',
        province: rawData.lokasi?.provinsi || ''
      },
      forecasts: rawData.data?.map((item: any) => ({
        datetime: item.local_datetime,
        temperature: item.t,
        humidity: item.hu,
        weather: item.weather_desc_en || item.weather_desc,
        windSpeed: item.ws,
        windDirection: item.wd
      })) || []
    };
  }
}

export default new BMKGService();
```

---

## 🚀 Development Workflow (2025 Standards)

### **Development Environment Setup**
```bash
# Start development
npx expo start

# Type checking
npx tsc --noEmit

# Testing on devices
npx expo start --tunnel  # For physical devices
```

### **Code Quality Standards**
1. **TypeScript Strict Mode**: All files must pass strict type checking
2. **Component-First**: Every UI element should be a reusable component  
3. **Hook-Based Logic**: Extract business logic into custom hooks
4. **Offline-First**: Always cache data and handle offline scenarios
5. **Performance**: Use React.memo, useMemo, and useCallback appropriately

### **Error Handling Strategy**
```typescript
// Global error boundary with offline fallback
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to crash reporting service
    console.error('App Error:', error, errorInfo);
  }

  handleReset = async () => {
    // Clear caches and retry
    await AsyncStorage.multiRemove(['@weather_cache', '@reports_cache']);
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorRecoveryScreen onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
```

---

## 📈 Performance Optimization (2025 Techniques)

### **React Query Optimizations**
- Use `staleTime` and `gcTime` appropriately
- Implement background refetching
- Use `suspense` queries for better UX
- Enable optimistic updates for mutations

### **React Native Optimizations**
- Use `React.memo` for expensive components
- Implement `FlatList` for large datasets
- Use `InteractionManager` for smooth animations
- Optimize images with proper formats and sizes

### **Bundle Size Optimization**
- Use Metro's tree shaking
- Dynamic imports for large screens
- Remove unused icons and assets
- Use Expo's selective imports

---

## 🎯 Final Implementation Notes

### **2025 Best Practices Applied**
✅ **TypeScript-first development** with strict configuration  
✅ **Offline-first architecture** with intelligent caching  
✅ **File-based routing** with Expo Router  
✅ **Material Design 3** with React Native Paper 5.0  
✅ **TanStack Query v5** with optimistic updates  
✅ **Firebase v10** with proper persistence  
✅ **Performance-optimized** components and hooks  
✅ **Error boundaries** with graceful fallbacks  

This tech stack provides a **modern, scalable, and maintainable** foundation for building the Indonesian Marine Weather app with **excellent offline capabilities** and **superior user experience** following 2025 industry standards.
