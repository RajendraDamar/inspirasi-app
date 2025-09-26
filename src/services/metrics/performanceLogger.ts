import { collection, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';

const PERSIST_KEY = '@inspirasi:notification_metrics';

export interface NotificationMetricsRecord {
  sendTimestamp: number;
  receiveTimestamp: number;
  deliveryLatency: number;
  platform: string;
  deviceState: string;
  success: boolean;
  alertType: string;
}

class PerformanceLogger {
  async log(metrics: NotificationMetricsRecord) {
    // Best-effort: persist locally first, then try to persist to Firestore if available
    try {
      const existingRaw = await AsyncStorage.getItem(PERSIST_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(metrics);
      await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(existing));
    } catch (e) {
      // ignore storage errors
      // eslint-disable-next-line no-console
      console.warn('Failed to write metrics to AsyncStorage', String(e));
    }

    // Attempt to write to Firestore collection 'notification_metrics' when Firestore is reachable
    try {
      await addDoc(collection(db, 'notification_metrics'), {
        ...metrics,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to write metrics to Firestore - will rely on local storage', String(e));
    }
  }

  async exportLocal(): Promise<NotificationMetricsRecord[]> {
    try {
      const raw = await AsyncStorage.getItem(PERSIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

export default new PerformanceLogger();
