import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from './backgroundTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_LOCATION_KEY = '@last_known_location';

class LocationService {
  async requestPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(options: Location.LocationOptions = { accuracy: Location.Accuracy.Balanced }) {
    try {
      const granted = await this.requestPermissions();
      if (!granted) {
        const cached = await this.getCachedLocation();
        return cached || null;
      }

      const loc = await Location.getCurrentPositionAsync(options);
      const payload = {
        coords: loc.coords,
        timestamp: loc.timestamp || Date.now()
      };
      await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(payload));
      return payload;
    } catch (e) {
      const cached = await this.getCachedLocation();
      return cached || null;
    }
  }

  async getCachedLocation() {
    try {
      const raw = await AsyncStorage.getItem(LAST_LOCATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async startBackgroundUpdates() {
    try {
      const has = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (has) return;
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30_000, // 30s
        distanceInterval: 50, // meters
        foregroundService: {
          notificationTitle: 'Inspirasi Location Service',
          notificationBody: 'Mengumpulkan lokasi untuk laporan nelayan',
        },
      });
    } catch (e) {
      console.error('Failed to start background updates', e);
    }
  }

  async stopBackgroundUpdates() {
    try {
      const has = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (!has) return;
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    } catch (e) {
      console.error('Failed to stop background updates', e);
    }
  }
}

export default new LocationService();
