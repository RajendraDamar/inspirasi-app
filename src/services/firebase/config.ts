import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { connectAuthEmulator } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

// Read Firebase configuration only from environment variables.
// Use EXPO_PUBLIC_* for values safe to expose to web, and non-public vars for server-only secrets.
const firebaseConfig = {
  apiKey: process.env.EXPO_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || undefined,
  authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || undefined,
  projectId: process.env.EXPO_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || undefined,
  storageBucket: process.env.EXPO_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId:
    process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
  appId: process.env.EXPO_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || undefined,
};

// initialize app with environment-backed config; keep existing behavior for local dev if env vars are not set
// Verify required fields are present at runtime to help catch misconfiguration early.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  // eslint-disable-next-line no-console
  console.warn('Firebase config appears incomplete. Ensure EXPO_FIREBASE_* or EXPO_PUBLIC_FIREBASE_* vars are set.');
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig as any) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Cloud Messaging for supported platforms (web/PWA).
// Important: per thesis requirements, FCM must use the real service. We intentionally do NOT
// connect the Messaging service to any local emulator even when other services use emulators.
let messaging: ReturnType<typeof getMessaging> | null = null;
try {
  // getMessaging will throw in some non-browser/native contexts; guard it.
  messaging = getMessaging(app);
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Firebase messaging not initialized in this environment', String(e));
}

// Connect to Firebase local emulators when developing locally or when explicitly enabled
// Enable by setting EXPO_USE_FIREBASE_EMULATOR=true or running with NODE_ENV=development
const useEmulator = process.env.EXPO_USE_FIREBASE_EMULATOR === 'true' || process.env.NODE_ENV === 'development';

if (useEmulator) {
  try {
    // Auth emulator (default port 9099)
    // connectAuthEmulator is safe to call in browser and Node environments
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (e) {
    // ignore if function not available or fails
    // eslint-disable-next-line no-console
    console.warn('connectAuthEmulator failed', String(e));
  }

  try {
    // Firestore emulator (configured port 8200)
    connectFirestoreEmulator(db, 'localhost', 8200);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('connectFirestoreEmulator failed', String(e));
  }

  try {
    // Storage emulator (default port 9199)
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('connectStorageEmulator failed', String(e));
  }

  // eslint-disable-next-line no-console
  console.info('Firebase: connected to local emulators (auth:9099, firestore:8200, storage:9199)');
}

export { app, auth, db, storage, messaging };
