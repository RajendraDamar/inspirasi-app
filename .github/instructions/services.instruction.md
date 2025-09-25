# Services Instructions for inspirasi-app

## 🌐 BMKG API Service with Caching

### **BMKG API Service (src/services/api/bmkgService.ts)**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface WeatherData {
  location: {
    village: string;
    district: string;
    city: string;
    province: string;
  };
  forecasts: Array<{
    datetime: string;
    temperature: number;
    humidity: number;
    weather: string;
    windSpeed: number;
    windDirection: string;
  }>;
  marine?: {
    waveHeight: number;
    waveCategory: string;
    seaTemperature: number;
  };
}

class BMKGService {
  private baseURL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
  private marineURL = 'https://peta-maritim.bmkg.go.id/public_api/perairan';
  private cacheKeyPrefix = '@weather_cache_';
  private cacheExpiry = 3 * 60 * 60 * 1000; // 3 hours

  async getWeatherByLocation(locationCode: string): Promise<WeatherData> {
    const cacheKey = this.cacheKeyPrefix + locationCode;

    try {
      // Check network connectivity
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        // Online: Fetch fresh data
        const response = await fetch(`${this.baseURL}?adm4=${locationCode}`, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MarineWeatherApp/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`BMKG API Error: ${response.status}`);
        }

        const data = await response.json();
        const processedData = this.processWeatherData(data);

        // Cache the fresh data
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          data: processedData,
          timestamp: Date.now()
        }));

        return processedData;
      } else {
        // Offline: Try to get cached data
        const cachedData = await this.getCachedWeather(locationCode);
        if (cachedData) {
          return cachedData;
        }
        throw new Error('No internet connection and no cached data available');
      }
    } catch (error) {
      // Fallback to cache if API fails
      const cachedData = await this.getCachedWeather(locationCode);
      if (cachedData) {
        return cachedData;
      }
      throw error;
    }
  }

  async getMarineConditions(locationCode: string): Promise<any> {
    try {
      const response = await fetch(`${this.marineURL}?location=${locationCode}`, {
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Marine API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Marine data unavailable:', error);
      return null; // Marine data is optional
    }
  }

  private async getCachedWeather(locationCode: string): Promise<WeatherData | null> {
    try {
      const cacheKey = this.cacheKeyPrefix + locationCode;
      const cachedString = await AsyncStorage.getItem(cacheKey);

      if (cachedString) {
        const cached = JSON.parse(cachedString);
        const isExpired = Date.now() - cached.timestamp > this.cacheExpiry;

        if (!isExpired) {
          return cached.data;
        }
      }
      return null;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  private processWeatherData(rawData: any): WeatherData {
    return {
      location: {
        village: rawData.lokasi?.desa || '',
        district: rawData.lokasi?.kecamatan || '',
        city: rawData.lokasi?.kota || '',
        province: rawData.lokasi?.provinsi || ''
      },
      forecasts: rawData.data?.map((item: any) => ({
        datetime: item.local_datetime,
        temperature: item.t,
        humidity: item.hu,
        weather: item.weather_desc_en || item.weather_desc,
        windSpeed: item.ws,
        windDirection: item.wd
      })) || []
    };
  }

  // Clear all cached weather data
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const weatherKeys = keys.filter(key => key.startsWith(this.cacheKeyPrefix));
      await AsyncStorage.multiRemove(weatherKeys);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}

export default new BMKGService();
```

---

## 🔔 Push Notifications Service

### **Notification Service (src/services/notifications/notificationService.ts)**

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { categoryIdentifier } = notification.request.content;

    return {
      shouldShowAlert: true,
      shouldPlaySound: categoryIdentifier === 'CRITICAL_WEATHER',
      shouldSetBadge: true,
    };
  },
});

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Get the token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn('No Expo project ID found');
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      this.expoPushToken = tokenData.data;

      // Setup notification categories
      await this.setupNotificationCategories();

      return this.expoPushToken;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  private async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('CRITICAL_WEATHER', [
      {
        identifier: 'VIEW_DETAILS',
        buttonTitle: 'View Details',
        options: { opensAppToForeground: true }
      },
      {
        identifier: 'DISMISS',
        buttonTitle: 'Dismiss',
        options: { opensAppToForeground: false }
      }
    ]);

    await Notifications.setNotificationCategoryAsync('MARINE_WARNING', [
      {
        identifier: 'VIEW_DETAILS',
        buttonTitle: 'View Details',
        options: { opensAppToForeground: true }
      }
    ]);
  }

  async scheduleWeatherAlert(alert: {
    title: string;
    body: string;
    data?: any;
    categoryId?: string;
  }): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: alert.title,
          body: alert.body,
          data: alert.data || {},
          categoryIdentifier: alert.categoryId || 'GENERAL_WEATHER',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  getToken(): string | null {
    return this.expoPushToken;
  }
}

export default new NotificationService();
```

---

## 📍 Location Service

### **Location Service (src/services/location/locationService.ts)**

```typescript
import * as Location from 'expo-location';
import { LOCATION_CODES } from '../../constants/locationCodes';

interface LocationData {
  latitude: number;
  longitude: number;
  locationCode: string;
  locationName: string;
  accuracy?: number;
}

class LocationService {
  private currentLocation: LocationData | null = null;

  async getCurrentLocation(): Promise<LocationData> {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 1000,
      });

      const { latitude, longitude } = position.coords;

      // Find nearest BMKG location code
      const locationCode = this.findNearestLocationCode(latitude, longitude);
      const locationName = this.getLocationName(locationCode);

      this.currentLocation = {
        latitude,
        longitude,
        locationCode,
        locationName,
        accuracy: position.coords.accuracy
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting location:', error);

      // Fallback to Jakarta if location fails
      return {
        latitude: -6.2088,
        longitude: 106.8456,
        locationCode: "31.71.03.1001",
        locationName: "Jakarta Pusat"
      };
    }
  }

  private findNearestLocationCode(lat: number, lng: number): string {
    // Simplified: Map regions to BMKG codes
    // In production, you'd use a proper geocoding service

    // Jakarta area
    if (lat >= -6.5 && lat <= -6.0 && lng >= 106.6 && lng <= 107.0) {
      return "31.71.03.1001"; // Jakarta Pusat
    }

    // Surabaya area
    if (lat >= -7.5 && lat <= -7.0 && lng >= 112.5 && lng <= 113.0) {
      return "35.78.15.2006"; // Surabaya
    }

    // Bandung area
    if (lat >= -7.0 && lat <= -6.5 && lng >= 107.3 && lng <= 107.9) {
      return "32.73.09.1002"; // Bandung
    }

    // Default to Jakarta if can't determine
    return "31.71.03.1001";
  }

  private getLocationName(locationCode: string): string {
    for (const [name, code] of Object.entries(LOCATION_CODES)) {
      if (code === locationCode) {
        return name;
      }
    }
    return "Unknown Location";
  }

  searchLocationByName(searchTerm: string): Array<{name: string, code: string}> {
    const results = Object.entries(LOCATION_CODES)
      .filter(([name]) => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([name, code]) => ({ name, code }))
      .slice(0, 10); // Limit to 10 results

    return results;
  }

  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }
}

export default new LocationService();
```

---

## 📊 Performance Monitoring

### **Performance Service (src/services/performance/performanceService.ts)**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PerformanceMetrics {
  screenLoadTimes: Record<string, number>;
  apiResponseTimes: Record<string, number[]>;
  errorCount: number;
  lastUpdated: number;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    screenLoadTimes: {},
    apiResponseTimes: {},
    errorCount: 0,
    lastUpdated: Date.now()
  };

  startTimer(timerName: string): () => number {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(timerName, duration);
      return duration;
    };
  }

  recordApiResponseTime(endpoint: string, duration: number): void {
    if (!this.metrics.apiResponseTimes[endpoint]) {
      this.metrics.apiResponseTimes[endpoint] = [];
    }

    this.metrics.apiResponseTimes[endpoint].push(duration);

    // Keep only last 10 measurements
    if (this.metrics.apiResponseTimes[endpoint].length > 10) {
      this.metrics.apiResponseTimes[endpoint].shift();
    }

    this.saveMetrics();
  }

  recordError(error: Error): void {
    this.metrics.errorCount++;
    this.metrics.lastUpdated = Date.now();

    console.warn('Performance: Error recorded', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    this.saveMetrics();
  }

  private recordMetric(name: string, duration: number): void {
    this.metrics.screenLoadTimes[name] = duration;
    this.metrics.lastUpdated = Date.now();
    this.saveMetrics();

    // Log slow operations
    if (duration > 3000) {
      console.warn(`Performance: Slow operation detected - ${name}: ${duration}ms`);
    }
  }

  private async saveMetrics(): Promise<void> {
    try {
      await AsyncStorage.setItem('@performance_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  async loadMetrics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('@performance_metrics');
      if (stored) {
        this.metrics = { ...this.metrics, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  async clearMetrics(): Promise<void> {
    this.metrics = {
      screenLoadTimes: {},
      apiResponseTimes: {},
      errorCount: 0,
      lastUpdated: Date.now()
    };
    await this.saveMetrics();
  }
}

export default new PerformanceService();
```
