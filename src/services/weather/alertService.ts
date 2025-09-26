import bmkgService from '../bmkg/bmkgService';
import PushService from '../notifications/pushNotifications';
import FCMTracker from '../notifications/fcmService';

type AlertPriority = 'low' | 'normal' | 'high' | 'critical';

class AlertService {
  // Evaluate forecasts and send alerts when thresholds are met.
  async evaluateAndNotify(locationCode: string) {
    try {
      const data = await bmkgService.fetchWeatherData(locationCode);
      if (!data || !data.forecasts) return;

      // Simple example: if any forecast has windSpeed > 15 m/s mark as high priority
      for (const f of data.forecasts) {
        const wind = Number(f.windSpeed || f.wind || 0);
        const alertType = wind > 20 ? 'emergency' : wind > 15 ? 'wind-alert' : 'general';
        const priority: AlertPriority = wind > 20 ? 'critical' : wind > 15 ? 'high' : 'normal';

        if (wind > 15) {
          const place = data.location?.city || data.location?.district || data.location?.village || data.location?.province || '';
          const title = `Alert: ${alertType} near ${place}`;
          const body = `Wind ${wind} m/s expected on ${f.date}`;

          // Use PushNotification service to send notification
          await PushService.sendNotification({
            title,
            body,
            category: 'marine',
            priority: priority === 'critical' || priority === 'high' ? 'high' : 'normal',
            data: {
              sendTimestamp: Date.now(),
              alertType,
              locationCode,
            },
          });

          // Log metrics using FCM tracker helper
          FCMTracker.createMetric(Date.now(), alertType as any, 'foreground', true);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Alert evaluation failed', String(e));
    }
  }
}

export default new AlertService();
