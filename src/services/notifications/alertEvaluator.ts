import { addDoc, collection } from 'firebase/firestore';
import bmkgService from '../api/bmkgService';
import { db } from '../firebase/config';
import pushNotifications from './pushNotifications';

// Thresholds (thesis-critical rules)
const THRESHOLDS = {
  waveDanger: 2.5, // meters
  waveExtreme: 4.0, // meters
  windDanger: 40, // km/h
};

export async function evaluateAndEmitAlerts({ cityCode, cityName }: { cityCode: string; cityName?: string }) {
  try {
    // Demo city to coordinates mapping (extend as needed)
    const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
      // Jakarta Pusat (approx)
      '3171010001': { lat: -6.17511, lon: 106.865039 },
      // Surabaya (example)
      '3573010001': { lat: -7.257472, lon: 112.752088 },
    };

    let waveHeight = 0;
    let windSpeed = 0;

    if (CITY_COORDS[cityCode]) {
      const { lat, lon } = CITY_COORDS[cityCode];
      const marine = await bmkgService.getMarineConditions(lat, lon).catch(() => null);
      if (marine) {
        waveHeight = marine.waveHeight || 0;
        windSpeed = marine.windSpeed || 0;
      }
    }

    // Fallback: use weather forecast first entry for wind speed if marine not available
    if (!windSpeed) {
      const weather = await bmkgService.getWeatherByLocation(cityCode).catch(() => null);
      if (weather && weather.forecasts && weather.forecasts.length > 0) {
        windSpeed = weather.forecasts[0].windSpeed || 0;
      }
    }

    const alerts: Array<{ level: 'critical' | 'warning'; message: string }> = [];

    if (waveHeight >= THRESHOLDS.waveExtreme) {
      alerts.push({ level: 'critical', message: `EXTREME WAVE WARNING for ${cityName || cityCode} - DO NOT GO TO SEA (H=${waveHeight}m)` });
    } else if (waveHeight >= THRESHOLDS.waveDanger) {
      alerts.push({ level: 'warning', message: `HIGH WAVES for ${cityName || cityCode} - Exercise extreme caution (H=${waveHeight}m)` });
    }

    if (windSpeed >= THRESHOLDS.windDanger) {
      alerts.push({ level: 'warning', message: `DANGEROUS WINDS for ${cityName || cityCode} - Consider returning to port (V=${windSpeed} km/h)` });
    }

  for (const a of alerts) {
      // Persist alert to Firestore 'alerts' for UI and history
      try {
        await addDoc(collection(db, 'alerts'), {
          cityCode,
          cityName: cityName || null,
          level: a.level,
          message: a.message,
          waveHeight,
          windSpeed,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to persist alert to Firestore', String(e));
      }

      // Emit notification via pushNotifications (emulator-friendly)
      try {
        await pushNotifications.sendNotification({
          title: a.level === 'critical' ? 'CRITICAL WEATHER ALERT' : 'Marine Warning',
          body: a.message,
          category: a.level === 'critical' ? 'critical' : 'marine',
          priority: a.level === 'critical' ? 'high' : 'normal',
          data: { cityCode },
        });
      } catch (e) {
        console.warn('Failed to send notification', String(e));
      }
    }

    return alerts;
  } catch (e) {
    console.warn('evaluateAndEmitAlerts failed', String(e));
    return null;
  }
}

export default { evaluateAndEmitAlerts };
