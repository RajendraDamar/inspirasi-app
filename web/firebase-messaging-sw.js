/* Firebase Messaging Service Worker
 * Listens for background messages and posts metrics to clients.
 * Note: This file must be copied to web-build root when building the PWA.
 */
self.addEventListener('push', (event) => {
  try {
    const payload = event.data ? event.data.json() : {};
    const now = Date.now();
    const sendTs = payload?.data?.sendTimestamp ? Number(payload.data.sendTimestamp) : now;
    const metrics = {
      sendTimestamp: sendTs,
      receiveTimestamp: now,
      deliveryLatency: now - sendTs,
      platform: 'pwa-chrome',
      deviceState: 'background',
      success: true,
      alertType: payload?.data?.alertType || 'general',
    };

    // Attempt to broadcast metrics to all open clients
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
          client.postMessage({ type: 'FCM_METRIC', payload: metrics });
        }
      })
    );
  } catch (e) {
    // ignore
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});
