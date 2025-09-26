import performanceLogger from '../metrics/performanceLogger';

export function installServiceWorkerMetricListener() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', (event: any) => {
    try {
      const data = event.data;
      if (!data || data.type !== 'FCM_METRIC') return;
      performanceLogger.log(data.payload).catch(() => {});
    } catch (e) {
      // ignore
    }
  });
}
