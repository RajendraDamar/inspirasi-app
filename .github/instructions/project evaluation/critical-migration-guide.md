# 🔄 CRITICAL MIGRATION GUIDE
## React Navigation → Expo Router (MANDATORY FIX)

**PURPOSE**: Fix the major violation in your repository - you're using React Navigation when requirements specify Expo Router ONLY.

---

## 🚨 CURRENT VIOLATIONS

### **❌ Wrong Navigation System**
Your repository is using React Navigation despite explicit requirements for Expo Router:

**Current Dependencies (REMOVE THESE)**:
```json
"@react-navigation/bottom-tabs": "^6.5.0",
"@react-navigation/native": "^6.1.0",
"react-native-screens": "~3.20.0",
"react-native-gesture-handler": "~2.9.0"
```

**Current Structure (WRONG)**:
```
/src/screens/
  - HomeScreen.tsx
  - ReportsScreen.tsx  
  - AuthScreen.tsx
/src/navigation/
  - TabNavigator.tsx
```

---

## ✅ REQUIRED MIGRATION STEPS

### **Step 1: Remove React Navigation**
```bash
# Remove all React Navigation packages
npm uninstall @react-navigation/native @react-navigation/bottom-tabs react-native-screens

# Clean package-lock and node_modules
rm package-lock.json
rm -rf node_modules
npm install
```

### **Step 2: Ensure Expo Router is Properly Installed**
```bash
# Ensure latest Expo Router
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Update app.json
```

### **Step 3: Update app.json/expo.json**
```json
{
  "expo": {
    "name": "Marine Weather Alert",
    "slug": "marine-weather-alert",
    "scheme": "marine-weather-alert",
    "platforms": ["android", "ios", "web"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### **Step 4: Create Proper /app Directory Structure**
```bash
# Create the correct Expo Router structure
mkdir -p app/(tabs)/forecasts
mkdir -p app/(auth)

# Move and rename files
mv src/screens/HomeScreen.tsx app/(tabs)/index.tsx
mv src/screens/ReportsScreen.tsx app/(tabs)/library.tsx
mv src/screens/AuthScreen.tsx app/(auth)/login.tsx

# Remove old navigation
rm -rf src/navigation/
rm -rf src/screens/
```

### **Step 5: Create Missing Root Layout**
**File**: `app/_layout.tsx`
```typescript
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ 
              headerShown: true, 
              title: "Settings" 
            }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
```

### **Step 6: Create Tabs Layout**
**File**: `app/(tabs)/_layout.tsx`
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
          tabBarActiveTintColor: '#1976D2',
          tabBarInactiveTintColor: '#666666',
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

### **Step 7: Fix App.tsx Entry Point**
**File**: `App.tsx`
```typescript
// Replace entire content with:
export { default } from 'expo-router/entry';
```

---

## 🎯 MISSING FEATURES TO IMPLEMENT

### **1. Create 5-Tab Forecasts System**
**File**: `app/(tabs)/forecasts/_layout.tsx`
```typescript
import { MaterialTopTabs } from '@react-navigation/material-top-tabs';

const Tab = MaterialTopTabs.Navigator;

export default function ForecastsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#666666',
        tabBarIndicatorStyle: { backgroundColor: '#1976D2' },
        tabBarScrollEnabled: true,
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

### **2. Create Missing Forecast Tab Files**
```bash
# Create all 5 forecast tab files
touch app/(tabs)/forecasts/index.tsx      # Weather
touch app/(tabs)/forecasts/wind.tsx       # Wind
touch app/(tabs)/forecasts/currents.tsx   # Currents
touch app/(tabs)/forecasts/waves.tsx      # Waves  
touch app/(tabs)/forecasts/tides.tsx      # Tides
```

### **3. Fix HomeScreen Implementation**
**Current HomeScreen.tsx is TOO BASIC**. Needs:
- Current conditions hero card
- 7-day forecast carousel
- Weather alerts section
- Fisherman reports feed
- Material Design 3 styling

### **4. Transform ReportsScreen → Library**
**Current ReportsScreen.tsx** only has basic form. Needs:
- Reports feed (public view)
- Report history (fishermen only)
- Alerts archive
- FAB for adding reports
- Sort and filter controls

---

## 🔧 DEPENDENCY FIXES

### **Remove Conflicting Packages**
```bash
npm uninstall @react-navigation/native @react-navigation/bottom-tabs react-native-screens
```

### **Add Missing Essential Packages** 
```bash
npm install @tanstack/react-query react-native-paper react-native-vector-icons
```

### **Update package.json Scripts**
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android", 
    "ios": "expo run:ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 📱 ENVIRONMENT SETUP FIXES

### **Fix .env.example**
Based on your Firebase config, update:
```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=REDACTED_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=inspirasi-1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=inspirasi-1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=inspirasi-1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1071267678705
EXPO_PUBLIC_FIREBASE_APP_ID=1:1071267678705:web:b8802b06621080b4071c50

# API Endpoints
EXPO_PUBLIC_BMKG_API_URL=https://api.bmkg.go.id/publik/prakiraan-cuaca
```

---

## 🎯 TESTING FIXES

### **Remove E2E Complexity**
Your repository has unnecessary E2E testing complexity with `?e2e=` parameters. For thesis project:

**SIMPLIFY**:
- Remove `?e2e=` forced routing
- Remove Playwright testing setup
- Remove `.playwright-mcp/` directory
- Remove `test-results/` directory
- Remove E2E scripts from package.json

**FOCUS ON**:
- Basic functionality testing
- Manual device testing
- Core feature validation

---

## 📋 IMPLEMENTATION PRIORITY

### **🚨 WEEK 1: Critical Fixes**
1. [ ] Remove React Navigation completely
2. [ ] Migrate to Expo Router structure
3. [ ] Fix App.tsx entry point
4. [ ] Create missing /app directory structure
5. [ ] Fix dependencies conflicts

### **⚠️ WEEK 2: Feature Implementation** 
1. [ ] Implement 5-tab forecasts system
2. [ ] Create proper Library screen
3. [ ] Add Settings screen
4. [ ] Implement alerts system
5. [ ] Add user role management

### **📈 WEEK 3: Enhancement**
1. [ ] Improve HomeScreen UI
2. [ ] Add Material Design 3 styling  
3. [ ] Implement offline functionality
4. [ ] Add proper error handling
5. [ ] Test on physical devices

---

**CRITICAL**: Your current repository violates major requirements. The React Navigation → Expo Router migration is MANDATORY and must be completed immediately to align with project specifications.