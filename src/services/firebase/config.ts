import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

export { app, auth, db, storage };
