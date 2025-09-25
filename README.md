# Inspirasi - Indonesian Marine Weather Early Warning System

Minimal scaffold created by Copilot to implement core features: BMKG integration, offline caching, Firebase, notifications, and basic UI.

See src/ for implementation.
 
Try it locally

1. Install dependencies: npm install
2. Run the TypeScript checker: npm run typecheck
3. Start the dev server: npx expo start

Testing notes
- For push notifications and background location, test on a physical device (Expo Go or standalone builds).
- Ensure you replace the Firebase config with environment variables for production.

Device testing checklist
- Test push notifications: run the app on a physical device, call pushNotifications.registerForPushNotificationsAsync(userId) and verify token saved to Firestore `users/{userId}`.
- Test background location: implement and enable background location tasks, then verify location is attached to reports when created while moving.
- Test offline report submission: disable network, submit a report, re-enable network, and verify `reports` doc created in Firestore.

Background location (dev notes)

- The app includes a background location TaskManager task named `INSPIRASI_BACKGROUND_LOCATION_TASK` (see `src/services/location/backgroundTask.ts`).
- To start background updates programmatically:

```tsx
import locationService from './src/services/location/locationService';

// after user grants permissions
await locationService.startBackgroundUpdates();

// to stop
await locationService.stopBackgroundUpdates();
```

- On Android you need `ACCESS_BACKGROUND_LOCATION` permission (configured in `app.json`). On iOS, ensure Background Modes > Location updates are enabled in Xcode for standalone builds.

DataSyncManager self-test

You can run a quick in-app self-test to verify queue persistence by calling `dataSyncManager.runSelfTest()` from a temporary component or `useEffect` and checking the boolean result. Example (debug use only):

```tsx
import dataSyncManager from './src/services/sync/dataSyncManager';

useEffect(() => {
	dataSyncManager.runSelfTest().then(ok => console.log('DataSync selftest ok:', ok));
}, []);
```



Firestore rules
- See `firebase/firestore.rules` for a basic role-based template. You must deploy these rules via Firebase CLI (firebase deploy --only firestore:rules) and ensure user custom claims (e.g., admin) are set by server-side admin tools.

EAS dev-client (quick guide)

1. Install EAS CLI and login:

```powershell
npm install -g eas-cli
eas login
```

2. Build a development client (uses `eas.json` profile `development`):

```powershell
npm run eas:dev
```

3. Install the generated dev client apk/ipa on your device and open it. Then run the app from the dev client to test background location and push notifications.


## Navigation & E2E (important)

- The app uses React Navigation (bottom-tabs) to implement the main layout: a top Appbar with a centered Searchbar and a bottom tab bar with icons and labels.
- For end-to-end checks we support a simple forcing mechanism via URL query parameter `?e2e=`. Valid values:
	- `?e2e=home` — render the Home screen directly
	- `?e2e=reports` — render the Reports screen directly
	- `?e2e=auth` — render the Auth screen directly

	This forces a simple, predictable DOM so external browser tools can land on the expected screen without waiting for navigation or auth flows.

	- E2E verification is performed using MCP-provided browser tools. Local terminal test runners and CI-run browser jobs have been removed from the repository.
	
	If you need to reproduce an E2E run locally for debugging, start the web server and use the `?e2e=` forced-route query parameter to render a deterministic screen; then use the MCP browser tools to drive the browser.

- The theme is centralized in `src/constants/theme.ts` and applies a blue primary palette via `PaperProvider` in `App.tsx`.

If you change navigation structure, keep `?e2e` behavior or update any external verification flows to account for new DOM structure.

Note about forced routes and bottom navigation
- The app's forced-route (`?e2e=`) rendering bypasses the Tab.Navigator for deterministic DOM. To still show a bottom bar in forced screens, the project includes a standalone BottomNav fallback (`src/components/common/BottomNav.tsx`) which renders a visual bottom bar on forced pages and navigates by updating `?e2e` in the URL. This keeps forced pages predictable while allowing visual navigation for screenshots and manual verification.

CI E2E note
- Automatic E2E runs in CI are disabled for this repository per maintainer preference; external MCP browser tools should be used to perform any verification. The GitHub Actions workflow was switched to manual/non-operational so runs must be started explicitly if ever re-enabled.


## Environment

This project reads configuration from environment variables. Copy `.env.example` to `.env` during local development and fill the required values.

- `.env.example` contains the list of variables the app expects (Firebase public values and the BMKG API url).
- Use `EXPO_PUBLIC_*` prefixed variables for values that are safe to expose in web builds. Keep private/secret values (server keys) outside the repository and in CI secrets.

If Firebase is not configured the app will log a warning on startup; calls that require Firebase may throw an error until the required env vars are set. Use `src/services/firebase/config.ts` -> `ensureFirebaseConfigured()` to assert configuration at runtime.

