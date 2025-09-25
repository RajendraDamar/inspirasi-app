import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class PushNotificationService {
  async registerForPushNotificationsAsync(userId?: string) {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for push notifications');
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { pushToken: token, tokenUpdatedAt: new Date() }, { merge: true });
      } catch (e) {
        console.error('Failed saving push token to Firestore', e);
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('general', {
        name: 'General',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return token;
  }
}

export default new PushNotificationService();
