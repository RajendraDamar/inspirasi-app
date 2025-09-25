# Configuration Instructions for inspirasi-app

## 🔥 Firebase Configuration

### **1. Firebase Config (src/services/firebase/config.ts)**

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "REDACTED_FIREBASE_API_KEY",
  authDomain: "inspirasi-1.firebaseapp.com",
  projectId: "inspirasi-1",
  storageBucket: "inspirasi-1.firebasestorage.app",
  messagingSenderId: "1071267678705",
  appId: "1:1071267678705:web:b8802b06621080b4071c50"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true // For Android compatibility
});

export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;
```

---

## 📱 App Configuration

### **2. app.json / expo.json Configuration**

```json
{
  "expo": {
    "name": "Marine Weather Alert",
    "slug": "marine-weather-alert",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1976D2"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.inspirasi.marineweather"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1976D2"
      },
      "package": "com.inspirasi.marineweather",
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#1976D2",
          "sounds": ["./assets/alert-sound.wav"]
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "This app needs access to location for weather data."
        }
      ]
    ],
    "scheme": "marine-weather-alert",
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

## 📦 Dependencies (No Versions - Let AI Choose Latest Compatible)

### **3. Essential Dependencies**

```json
{
  "dependencies": {
    "expo": "",
    "react": "",
    "react-native": "",

    "expo-router": "",
    "expo-font": "",
    "expo-linking": "",
    "expo-constants": "",
    "expo-status-bar": "",

    "react-native-paper": "",
    "react-native-vector-icons": "",

    "firebase": "",
    "@react-native-async-storage/async-storage": "",

    "expo-location": "",
    "expo-notifications": "",
    "expo-device": "",

    "@tanstack/react-query": "",
    "@react-native-community/netinfo": "",

    "react-hook-form": "",
    "@hookform/resolvers": "",
    "zod": ""
  },
  "devDependencies": {
    "@types/react": "",
    "@types/react-native": "",
    "typescript": "",
    "@expo/webpack-config": ""
  }
}
```

### **4. Remove These (Conflicts with Expo Router)**

❌ DO NOT INSTALL:
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/stack
- react-native-safe-area-context (conflicts with Expo Router)
- react-native-screens (conflicts with Expo Router)
- react-native-gesture-handler (use Expo's instead)

---

## 🌐 Environment Variables

### **5. .env Configuration**

```bash
# API Endpoints
EXPO_PUBLIC_BMKG_WEATHER_API=https://api.bmkg.go.id/publik/prakiraan-cuaca
EXPO_PUBLIC_BMKG_MARINE_API=https://peta-maritim.bmkg.go.id/public_api/perairan

# Firebase (already in config, but useful for CI/CD)
EXPO_PUBLIC_FIREBASE_PROJECT_ID=inspirasi-1

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true

# Cache Durations (in milliseconds)
EXPO_PUBLIC_WEATHER_CACHE_DURATION=10800000
EXPO_PUBLIC_REPORT_CACHE_DURATION=86400000
```

---

## 🎨 Theme Configuration

### **6. Material Design 3 Theme (src/constants/colors.ts)**

```typescript
export const Colors = {
  light: {
    primary: '#1976D2',
    primaryVariant: '#1565C0',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#F44336',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',

    // Alert colors
    alertHigh: '#F44336',
    alertMedium: '#FF9800',
    alertLow: '#4CAF50'
  },
  dark: {
    primary: '#1565C0',
    primaryVariant: '#0D47A1',
    secondary: '#018786',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',

    // Alert colors
    alertHigh: '#FF5252',
    alertMedium: '#FFC107',
    alertLow: '#66BB6A'
  }
};
```

---

## 🔐 Firestore Security Rules

### **7. firestore.rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Weather data - public read only
    match /weather_data/{document} {
      allow read: if true;
      allow write: if false;
    }

    // Alerts - public read only
    match /alerts/{document} {
      allow read: if true;
      allow write: if false;
    }

    // Reports - public read, fishermen can create
    match /reports/{document} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.auth.token.user_type == 'fisherman';
      allow update, delete: if false; // Immutable
    }

    // Users - owner only
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

---

## 📋 Location Codes Configuration

### **8. BMKG Location Codes (src/constants/locationCodes.ts)**

```typescript
export const LOCATION_CODES = {
  // Jakarta & Surrounding (fixed format)
  "Jakarta Pusat": "31.71.03.1001",
  "Jakarta Utara": "31.72.06.1006", 
  "Jakarta Selatan": "31.74.08.1008",
  "Tangerang": "36.71.04.1004",
  "Bekasi": "32.75.01.1008",
  "Depok": "32.76.02.1001",

  // Major Cities
  "Surabaya": "35.78.15.2006",
  "Bandung": "32.73.09.1002", 
  "Medan": "12.71.05.1003",
  "Semarang": "33.74.14.1006",
  "Makassar": "73.71.07.1002",
  "Palembang": "16.71.12.1001",

  // Coastal Cities (Important for fishermen)
  "Banyuwangi": "35.10.04.2005",
  "Cilacap": "33.01.11.2006",
  "Pekalongan": "33.75.02.1002",
  "Tegal": "33.77.03.1003"
};
```
