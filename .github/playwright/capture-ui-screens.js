/**
 * Playwright script (Node) to capture multiple screenshots of the running app.
 * This script expects the Expo dev server to be running and reachable at a given URL.
 * Usage:
 *   node .github/playwright/capture-ui-screens.js --url http://localhost:19006
 */
const { chromium, webkit, devices } = require('playwright');
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');

const argv = minimist(process.argv.slice(2));
const baseUrl = argv.url || process.env.EXPO_DEV_URL || 'http://localhost:19006';
const outDir = path.join(process.cwd(), 'docs', 'ui-screenshots');
fs.mkdirSync(outDir, { recursive: true });

const screens = [
  { name: 'home-screen-hero-weather.png', path: '/' },
  { name: 'forecasts-navigation-tabs.png', path: '/forecasts' },
  { name: 'library-saved-locations.png', path: '/library' },
  { name: 'settings-md3-sections.png', path: '/settings' },
  { name: 'debug-metrics-dashboard.png', path: '/debug/metrics' },
  { name: 'wind-forecast-detail.png', path: '/forecasts/wind' },
  { name: 'currents-forecast-detail.png', path: '/forecasts/currents' },
  { name: 'waves-forecast-detail.png', path: '/forecasts/waves' },
  { name: 'weather-forecast-detail.png', path: '/forecasts/weather' },
  { name: 'tides-forecast-detail.png', path: '/forecasts/tides' },
];

async function capture(viewport, suffix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const s of screens) {
    const url = baseUrl.replace(/\/$/, '') + s.path;
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      const fullPath = path.join(outDir, `${s.name.replace('.png', '')}${suffix}.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log('Captured', fullPath);
    } catch (e) {
      console.warn('Failed to capture', s.path, String(e));
    }
  }
  await browser.close();
}

(async () => {
  // Mobile portrait
  await capture({ width: 375, height: 812 }, '-mobile-portrait');
  // Mobile landscape
  await capture({ width: 812, height: 375 }, '-mobile-landscape');
  // Tablet / desktop
  await capture({ width: 1024, height: 768 }, '-tablet');
})();
