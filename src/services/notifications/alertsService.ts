import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';

export type AlertItem = {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  category?: string;
  priority?: string;
  createdAt?: string;
};

const COLLECTION = 'outgoing_notifications';

export async function listAlerts(): Promise<AlertItem[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items: AlertItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      items.push({ id: d.id, title: data.title, body: data.body, data: data.data, category: data.category, priority: data.priority, createdAt: data.createdAt });
    });
    // cache locally
    await AsyncStorage.setItem('@alerts_cache', JSON.stringify(items));
    return items;
  } catch (e) {
    // fallback to cache
    try {
      const raw = await AsyncStorage.getItem('@alerts_cache');
      if (raw) return JSON.parse(raw) as AlertItem[];
    } catch (ee) {
      // ignore
    }
    return [];
  }
}

export function subscribeAlerts(onChange: (items: AlertItem[]) => void) {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: AlertItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        items.push({ id: d.id, title: data.title, body: data.body, data: data.data, category: data.category, priority: data.priority, createdAt: data.createdAt });
      });
      onChange(items);
    }, (err) => {
      console.warn('subscribeAlerts error', String(err));
    });
    return unsub;
  } catch (e) {
    console.warn('subscribeAlerts failed', String(e));
    return () => { /* noop */ };
  }
}
