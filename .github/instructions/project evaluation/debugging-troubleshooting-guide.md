# 🐛 DEBUGGING & TROUBLESHOOTING GUIDE
## Fix Common Issues in Maritime EWS Development

**PURPOSE**: Help debug issues that will arise during development and provide solutions for common problems.

---

## 🚨 CURRENT REPOSITORY ISSUES

### **1. Firebase Configuration Problems**
**ISSUE**: Firebase config using environment variables but .env not properly set up

**FIX**: Create proper environment setup
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your actual Firebase keys to .env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=inspirasi-1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=inspirasi-1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=inspirasi-1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1071267678705
EXPO_PUBLIC_FIREBASE_APP_ID=1:1071267678705:web:b8802b06621080b4071c50
```

### **2. TypeScript Errors**
**ISSUE**: Strict TypeScript enabled but code has type errors

**COMMON FIXES**:
```typescript
// Fix undefined access
const weather = weatherData?.forecasts?.[0]; // Add optional chaining

// Fix any types
interface WeatherData {
  location: {
    city?: string;    // Make optional
    province?: string;
  };
  forecasts: WeatherForecast[]; // Define proper interface
}

// Fix missing type imports
import type { User } from '../types/auth';
import type { WeatherData } from '../types/weather';
```

### **3. BMKG API Issues**
**ISSUE**: Location codes format wrong in bmkgService.ts

**FIX**: Update location codes to correct format
```typescript
// Wrong format in current code
const locationCode = '3171010001';

// Correct format required
const locationCode = '31.71.03.1001';

// Update in bmkgService.ts
private getDefaultLocationCode(): string {
  return '31.71.03.1001'; // Jakarta Pusat - correct format
}
```

---

## 🛠️ DEVELOPMENT DEBUGGING

### **1. Expo Router Migration Issues**

**Problem**: App crashes after removing React Navigation
**Solution**:
```bash
# Clear Metro cache
npx expo start --clear

# Reset node_modules
rm -rf node_modules package-lock.json
npm install

# Ensure proper entry point in App.tsx
echo "export { default } from 'expo-router/entry';" > App.tsx
```

**Problem**: Screens not loading with Expo Router
**Solution**: Check file naming conventions
```bash
# Expo Router is strict about file names:
app/(tabs)/index.tsx        # ✅ Correct
app/(tabs)/home.tsx         # ❌ Wrong - use index.tsx
app/(tabs)/forecasts/       # ✅ Correct nested routing
```

### **2. Firebase Authentication Issues**

**Problem**: Auth state not persisting
**Solution**: Ensure proper AsyncStorage setup
```typescript
// In src/services/firebase/config.ts
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
```

**Problem**: User roles not working
**Solution**: Set custom claims in Firestore
```typescript
// After user registration
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: user.email,
  displayName: displayName,
  userType: selectedUserType, // 'fisherman' or 'general'
  createdAt: new Date()
});
```

### **3. Push Notifications Debug**

**Problem**: Notifications not working on device
**Solution**: Debug step by step
```typescript
// Test notification setup
const debugNotifications = async () => {
  console.log('Device type:', Device.deviceType);
  console.log('Is physical device:', Device.isDevice);

  const permissions = await Notifications.getPermissionsAsync();
  console.log('Notification permissions:', permissions);

  if (permissions.status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    console.log('Requested permissions:', requested);
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Push token:', token.data);
  } catch (error) {
    console.error('Error getting push token:', error);
  }
};
```

---

## 🔧 COMMON FIXES

### **1. React Native Paper Import Issues**
```typescript
// If Card.Content is undefined
import { Card, Text } from 'react-native-paper';

// Safe way to access Card.Content
const CardContent = (Card as any).Content || ((props: any) => (
  <View style={{ padding: 16 }}>
    {props.children}
  </View>
));

// Then use:
<Card>
  <CardContent>
    <Text>Content here</Text>
  </CardContent>
</Card>
```

### **2. AsyncStorage Data Corruption**
```typescript
// Clear corrupted cache
const clearCorruptedCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const weatherKeys = keys.filter(key => key.startsWith('@weather_cache_'));
    await AsyncStorage.multiRemove(weatherKeys);
    console.log('Cleared corrupted weather cache');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
```

### **3. Location Service Not Working**
```typescript
// Debug location service
import * as Location from 'expo-location';

const debugLocationService = async () => {
  try {
    // Check permissions
    const { status } = await Location.getForegroundPermissionsAsync();
    console.log('Location permission status:', status);

    if (status !== 'granted') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('Requested permission status:', newStatus);

      if (newStatus !== 'granted') {
        console.log('Location permission denied, using default location');
        return null;
      }
    }

    // Test location fetch
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    console.log('Current location:', location.coords);
    return location.coords;
  } catch (error) {
    console.error('Location service error:', error);
    return null;
  }
};
```

---

## 📋 TROUBLESHOOTING CHECKLIST

### **🚨 Before Starting Development**
- [ ] Remove all React Navigation packages
- [ ] Create proper /app directory structure  
- [ ] Fix App.tsx entry point
- [ ] Set up .env file with Firebase keys
- [ ] Clear Metro cache and reinstall dependencies

### **⚠️ During Development**
- [ ] Check TypeScript errors with `npm run typecheck`
- [ ] Test on physical device for location and notifications
- [ ] Verify BMKG API calls with correct location codes
- [ ] Test offline functionality by disabling network
- [ ] Monitor console for Firebase authentication errors

### **✅ Before Testing**
- [ ] Ensure all required screens are implemented
- [ ] Test navigation between all tabs and screens
- [ ] Verify user role management works correctly
- [ ] Test critical features (weather, alerts, reports)
- [ ] Check Material Design 3 styling consistency

---

**CRITICAL**: Your repository currently has major architectural violations. Follow this debugging guide to fix issues systematically and ensure proper functionality.