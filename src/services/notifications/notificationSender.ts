import { addDoc, collection } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { db } from '../firebase/config';

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
  category?: 'critical' | 'marine' | 'general';
  priority?: 'high' | 'normal';
  targetUserId?: string;
};

const useEmulator = process.env.EXPO_USE_FIREBASE_EMULATOR === 'true' || process.env.NODE_ENV === 'development';

export async function emitNotificationToEmulator(payload: NotificationPayload) {
  if (!useEmulator) return null;
  try {
    // Persist outgoing notifications so tests or the dev UI can inspect them
    const docRef = await addDoc(collection(db, 'outgoing_notifications'), {
      ...payload,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (e) {
    console.warn('Failed to write outgoing notification to emulator', String(e));
    return null;
  }
}

export async function scheduleLocalNotification(payload: NotificationPayload) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        categoryIdentifier: payload.category || 'general',
      },
      trigger: null, // immediate
    });
  } catch (e) {
    console.warn('Failed to schedule local notification', String(e));
  }
}

export default { emitNotificationToEmulator, scheduleLocalNotification };
