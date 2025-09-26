import { messaging } from '../firebase/config';
import { onMessage as onMessageWeb } from 'firebase/messaging';
import { Platform } from 'react-native';
import performanceLogger from '../metrics/performanceLogger';

export interface NotificationMetrics {
  sendTimestamp: number;
  receiveTimestamp: number;
  deliveryLatency: number; // ms
  platform: 'native-ios' | 'native-android' | 'pwa-chrome' | 'pwa-safari' | 'unknown';
  deviceState: 'foreground' | 'background' | 'locked' | 'unknown';
  success: boolean;
  alertType: 'weather-warning' | 'tide-alert' | 'wind-alert' | 'emergency' | 'general';
}

export class FCMPerformanceTracker {
  private unsubscribeWeb: (() => void) | null = null;

  start() {
    // Listen for messages on supported web builds (PWA) using firebase/messaging
    if (messaging && typeof window !== 'undefined') {
      try {
        this.unsubscribeWeb = onMessageWeb(messaging as any, (payload: any) => {
          try {
            const now = Date.now();
            const sendTs = payload?.data?.sendTimestamp ? Number(payload.data.sendTimestamp) : now;
            const metrics: NotificationMetrics = {
              sendTimestamp: sendTs,
              receiveTimestamp: now,
              deliveryLatency: now - sendTs,
              platform: this.detectPlatform(),
              deviceState: document.hasFocus() ? 'foreground' : 'background',
              success: true,
              alertType: (payload?.data?.alertType as NotificationMetrics['alertType']) || 'general',
            };
            performanceLogger.log(metrics);
          } catch (e) {
            console.warn('FCM web onMessage handler failed', e);
          }
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to attach web messaging onMessage listener', String(e));
      }
    }

    // Native (expo) receives notifications via expo-notifications; we rely on existing handlers
    // to forward metrics to performanceLogger. This class focuses on PWA web listener and shared helpers.
  }

  stop() {
    if (this.unsubscribeWeb) {
      try {
        this.unsubscribeWeb();
      } catch (e) {
        // ignore
      }
      this.unsubscribeWeb = null;
    }
  }

  createMetric(sendTimestamp: number, alertType: NotificationMetrics['alertType'], deviceState: NotificationMetrics['deviceState'], success = true) {
    const now = Date.now();
    const metrics: NotificationMetrics = {
      sendTimestamp,
      receiveTimestamp: now,
      deliveryLatency: now - sendTimestamp,
      platform: this.detectPlatform(),
      deviceState,
      success,
      alertType,
    };
    performanceLogger.log(metrics);
    return metrics;
  }

  private detectPlatform(): NotificationMetrics['platform'] {
    if (Platform.OS === 'ios') return 'native-ios';
    if (Platform.OS === 'android') return 'native-android';
    // Web paths: attempt to detect Safari vs Chrome heuristically
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/CriOS|Chrome/.test(ua)) return 'pwa-chrome';
      if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'pwa-safari';
    }
    return 'unknown';
  }
}

export default new FCMPerformanceTracker();
