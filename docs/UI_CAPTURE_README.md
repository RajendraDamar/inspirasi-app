UI Screenshot Capture

1) Start Expo dev server locally (web build) and make sure the app is accessible in the browser:

```bash
npm install
expo start --tunnel
# or for web-only preview
expo start --web
```

2) Install Playwright deps (locally):

```bash
npm install --save-dev @playwright/test
npx playwright install
```

3) Run the capture script (adjust URL if your dev server uses a different host/port):

```bash
node .github/playwright/capture-ui-screens.js --url http://localhost:19006
```

Captured screenshots will be written to `docs/ui-screenshots/` with suffixes for viewport sizes.
