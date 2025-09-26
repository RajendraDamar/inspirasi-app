````markdown
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
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
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

...[truncated]

````
