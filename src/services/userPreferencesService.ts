import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase/config';

export type Preferences = {
  language: 'id' | 'en';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  refreshIntervalMinutes: number;
  defaultLocationCode?: string;
  useGps: boolean;
  bmkgApiEndpoint?: string;
  cacheDurationMinutes: number;
  offlineMode: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  language: 'id',
  notifications: { push: true, email: false, sms: false },
  theme: 'light',
  refreshIntervalMinutes: 15,
  defaultLocationCode: undefined,
  useGps: true,
  bmkgApiEndpoint: undefined,
  cacheDurationMinutes: 60,
  offlineMode: false,
};

const COLLECTION = 'user_preferences';

export async function readPreferences(userId: string): Promise<Preferences> {
  try {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as any;
      // merge with defaults
      return { ...DEFAULT_PREFERENCES, ...data } as Preferences;
    }
    // fallback to local cache
    const raw = await AsyncStorage.getItem(`@prefs_${userId}`);
    if (raw) return JSON.parse(raw) as Preferences;
    return { ...DEFAULT_PREFERENCES };
  } catch (e) {
    console.warn('readPreferences failed', String(e));
    const raw = await AsyncStorage.getItem(`@prefs_${userId}`);
    if (raw) return JSON.parse(raw) as Preferences;
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function writePreferences(userId: string, prefs: Partial<Preferences>): Promise<boolean> {
  try {
    const ref = doc(db, COLLECTION, userId);
    await setDoc(ref, prefs, { merge: true });
    // update local cache
    const current = await readPreferences(userId);
    await AsyncStorage.setItem(`@prefs_${userId}`, JSON.stringify({ ...current, ...prefs }));
    return true;
  } catch (e) {
    console.warn('writePreferences failed', String(e));
    return false;
  }
}

export function subscribePreferences(userId: string, onChange: (prefs: Preferences) => void) {
  const ref = doc(db, COLLECTION, userId);
  const unsub = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      onChange({ ...DEFAULT_PREFERENCES, ...(snap.data() as any) } as Preferences);
    }
  }, (err) => console.warn('subscribePreferences error', String(err)));
  return unsub;
}
