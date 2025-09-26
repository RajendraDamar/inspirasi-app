---
applyTo: '**'
---

# User Memory

## User Preferences
- Programming languages: TypeScript
- Frameworks: React Native, Expo
- Project style: Mobile-first, offline-capable, blue-themed UI
## User Preferences
- Languages: TypeScript (primary)
- Frameworks & libraries: Expo (managed workflow), React Native, Expo Router, React Native Paper, React Query
- Project style: Mobile-first, offline-first, Material Design (blue theme)
- Tech stack: Expo (managed), React Native, TypeScript, Firebase, React Query
- Key features: BMKG API integration, marine warnings, offline caching, push notifications, role-based reports
## Project Context
- Project: Inspirasi — Indonesian Marine Weather Early Warning System (mobile-first, PWA/web support)
- Primary stack: Expo (managed), Expo Router (file-based routing), React Native + TypeScript, React Native Paper (Material 3), @tanstack/react-query
- Backend & services: Firebase (Auth, Firestore, Storage, Messaging), BMKG public APIs for weather & marine data
- Key features: current conditions + 7-day forecasts, marine conditions (waves/tides), location detection, offline caching, push notifications, fisherman report system with role-based access

## Recent Session Notes
## Instruction Files Reviewed
- `.github/copilot-instructions.md`: high-level project overview and where to find detailed instruction files.
- `.github/instructions/architecture.instruction.md`: app architecture, screen specs, navigation patterns (Expo Router), design system, roles.
- `.github/instructions/configuration.instruction.md`: Firebase initialization snippet, app.json examples, dependency guidance, environment variables, color/theme constants, Firestore rules, BMKG location codes.
---

## Recent Automated Session Summary

- Created/updated `.env` with EXPO_PUBLIC_FIREBASE_* variables and wired `src/services/firebase/config.ts` to auto-connect to local Firebase emulators when `EXPO_USE_FIREBASE_EMULATOR=true` or `NODE_ENV=development`.
- Fixed a web white-screen caused by duplicate root registration by adjusting `App.tsx` to export the router entry directly.
- Implemented Forecasts UI at `app/(tabs)/forecasts/index.tsx` and wired it to existing hooks (`useWeatherData`, `useMarineForecast`).
- Ran Playwright MCP browser checks against the running Expo web server; captured screenshots, console logs, and visible text under `.playwright-mcp/` (artifacts include `forecasts-tab-with-content.png`, `forecasts-visible-text.txt`, `console-full.log`).
- Consolidated repository instructions into five essential `.instruction.md` files and archived legacy docs under `.github/instructions/.archive/`.
- Added `firebase.json` (emulator config) and `.github/instructions/firebase-emulator.instruction.md` for local emulator guidance.

## Latest Actions

- Created and pushed branch `feature/settings-tab-implementation` with Settings UI, services, and hooks; backup branch `backup/feature-settings-before-merge` created prior to merge.
- Merged `origin/main` into `feature/settings-tab-implementation` preferring the feature branch changes to resolve unrelated-history conflicts.
- Pushed the merged branch to origin and created Pull Request #9: https://github.com/RajendraDamar/inspirasi-app/pull/9 (title: "feat: Settings tab (user preferences, offline-first)").

# User Memory

## Summary
- Project: Inspirasi — Indonesian Marine Weather Early Warning System.
- Stack: Expo (managed) + Expo Router, React Native, TypeScript, React Native Paper (Material 3), @tanstack/react-query, Firebase (Auth/Firestore/Storage/Messaging).
- Primary purpose: mobile-first weather & marine conditions app with offline-first behavior, push notifications, and a fisherman reporting system.

## Instruction files reviewed
- `.github/copilot-instructions.md` — project overview and pointer to specialized instruction files.
- `.github/instructions/architecture.instruction.md` — app architecture, routes, screens, design system, roles, and data flow.
- `.github/instructions/configuration.instruction.md` — Firebase init example, `app.json` example, dependency guidance, environment variables, colors, Firestore rules, and BMKG location codes.
- `.github/instructions/services.instruction.md` — BMKG API service with caching, notification service, location service, and service patterns.
- `.github/instructions/components.instruction.md` — hooks and components (useWeatherData, useLocation, Root layout, Tabs layout, Header, WeatherCard, ErrorBoundary).
- `.github/instructions/deployment.instruction.md` — deployment checklist and CI/E2E guidance.

## Notable repository facts (authoritative)
- Routing: uses Expo Router (file-based routing). Do not add conflicting `@react-navigation` packages unless migrating away from Expo Router.
- The app root layout is `app/_layout.tsx` which wires QueryClientProvider, PaperProvider, and AuthProvider.
 If CI reliability is needed later, the instructions recommend building a static web export and serving it for external browser verification to avoid Metro flakiness.
	- Actions: Document local verification steps in README; optionally add a CI pathway that builds a static web bundle and serves it for external browser verification.
- Firestore rules example: public-read for weather/alerts; `reports` collection allows create only for authenticated users with `user_type == 'fisherman'`.

## Defaults and examples referenced
- Default BMKG location code shown in the instructions: `31.71.03.1001` (Jakarta Pusat).
- Theme primary colors in examples: light `#1976D2`, dark `#1565C0` (Material 3 blue variants).
- `app.json` example in instructions includes plugins: `expo-notifications`, `expo-location`, and web bundler set to `metro`.

## E2E & CI guidance (maintainer preference)
 If CI reliability is needed later, the instructions recommend building a static web export and serving it for external browser verification to avoid Metro flakiness.

## E2E policy (owner preference)
 - The repository owner has mandated that MCP-provided browser tools are the exclusive method to run E2E checks for this project. Local terminal-based test runners and CI-run browser jobs have been removed from the repository.
	- All local E2E spec files that previously depended on local test runners have been removed from the repository to prevent accidental execution; historical test code has been archived outside the repo when needed.
	- The GitHub Actions E2E workflow is non-operational and will not run local browser test runners in automation.
	- The project `package.json` no longer lists local terminal-based E2E devDependencies or `e2e` scripts.
	- `package-lock.json` entries for local test runners were archived; regenerate a fresh lockfile locally with `npm install` if needed.
---
applyTo: '**'
---

# Development Memory & Protocols

## 🔥 HOT RELOAD PROTOCOL
NEVER restart the web dev server unnecessarily.
- Keep `npm run web` running and rely on hot reload for code changes.
- Restart only when you change `package.json`, native modules, or environment variables.

## CRITICAL SERVER MANAGEMENT PROTOCOL

### 🔥 NEVER RESTART THESE SERVERS UNLESS PACKAGE.JSON CHANGES
- ✅ Firebase Emulator: `npx firebase emulators:start` (KEEP RUNNING)
- ✅ Expo Dev Server: `npm run web` (KEEP RUNNING)
- ✅ These run for HOURS - use hot reload for all code changes

### ⚠️ WHEN TO RESTART (Only These Cases)
- package.json dependencies change
- Firebase emulator crashes
- User explicitly says "restart server"
- Otherwise: NEVER restart, use hot reload

### 🚫 PROHIBITED ACTIONS
- Starting `npm run web` when server already running
- Starting Firebase emulator when already running
- Restarting for TypeScript changes (hot reload handles this)
- Restarting for new files (hot reload handles this)

### ✅ HOT RELOAD HANDLES
- New files (library.tsx, components)
- TypeScript changes
- UI component updates
- Firebase config updates
- All code changes except package.json

### 📋 DEVELOPMENT WORKFLOW MEMORY
Terminal 1: Firebase emulator (keep running)
Terminal 2: `npm run web` (keep running)
Terminal 3: Testing commands only

REMEMBER: The servers are designed to run continuously. Hot reload is THE workflow.

### 🎯 IMMEDIATE CORRECTION

If duplicate servers were started (for example, `npm run web` started twice), fix this now:

1. Stop the extra `npm run web` instance (Ctrl+C in that terminal).
2. Use the original running server and rely on hot reload.
3. Test Library tab with hot reload (it should reflect changes immediately).


## 🤖 PLAYWRIGHT MCP TESTING
Use the built-in MCP Playwright helpers for all automated UI checks:
- `playwright_navigate`
- `playwright_click`
- `playwright_screenshot`
- `playwright_console_logs`

## 🚫 NEVER INSTALL
- Puppeteer (use Playwright MCP)
- React Navigation (use Expo Router)
- Any extra testing libraries (MCP provided)

## ✅ SUCCESS PATTERNS
- Firebase Local Emulator working
- Bottom tabs functional
- Forecasts tab implemented
- Playwright testing established

## ARCHIVE OLD FILES
When compacting docs, move legacy or deep-dive guides into `.archive/` inside `.github/instructions` to reduce noise.


- E2E workflow fragility (Low/Medium): `e2e:ci` uses `npx expo start --web` and `start-server-and-test` which can be flaky on CI because Metro dev server is not a static server. The repo's GitHub Actions uses manual dispatch which is reasonable; for automated CI consider building a static web export and serving it for external browser verification to improve reliability.

- Caching & offline queue (Info): `src/services/sync/dataSyncManager.ts` implements an offline queue persisted in AsyncStorage which is in line with instructions; ensure robust error handling and logging around retry/backoff.

- Notifications setup (Info/Actionable): `src/services/notifications/pushNotifications.ts` registers tokens and writes them to Firestore. Confirm token storage rules and use App Check where possible. For background handling follow Expo & Firebase best practices.

- BMKG API usage (Info/Actionable): `src/services/api/bmkgService.ts` implements caching via AsyncStorage; ensure cache expiry and errors are surfaced to UI. Consider using React Query's cache for UI-consistent stale-while-revalidate behavior.

## Immediate recommended fixes (low-risk, prioritized)

1) Move Firebase config to environment variables (Critical)
	- Files: `src/services/firebase/config.ts`
	- Actions: Replace inline `firebaseConfig` with `process.env.EXPO_FIREBASE_API_KEY` etc. Update `app.json` / EAS / CI secrets and `.env.example`.

2) Add BMKG location codes constants (Medium)
	- File to add: `src/constants/locationCodes.ts`
	- Contents: export a typed map of location name -> BMKG code. Replace hardcoded default `3171010001` usages with references to this constant.

3) Consolidate routing (High)
	- Files: `App.tsx`, `app/_layout.tsx`, `src/navigation/AppNavigator.tsx`, `package.json` deps
	- Actions: Prefer Expo Router as primary; remove the fallback navigator and uninstall `@react-navigation/*` if not required.

4) Tighten TypeScript config (Medium)
	- File: `tsconfig.json`
	- Actions: Re-enable `strict` or at least `noImplicitAny`, run `npm run typecheck`, and fix reported issues.

5) E2E reliability (Low/Medium)
	- Files: `.github/workflows/e2e.yml`, `package.json` scripts
	- Actions: Document local E2E steps in README; optionally add a CI pathway that builds a static web bundle and serves it for external browser verification.

## Where these findings were observed (representative files)

- `App.tsx` — contains dual-routing logic and `e2e` query param handling (fallback to `AppNavigator`).
- `app/_layout.tsx` — proper Expo Router root layout wiring QueryClientProvider and PaperProvider (preferred root).
- `src/navigation/AppNavigator.tsx` — React Navigation fallback; consider removal if Expo Router is primary.
- `src/services/firebase/config.ts` — inline firebaseConfig (move to env).
- `src/services/api/bmkgService.ts` — BMKG fetch + AsyncStorage caching (validate and align to react-query where useful).
- `src/services/sync/dataSyncManager.ts` — offline queue implementation; confirm robust retry/backoff.
- `package.json` — includes `expo-router` and `@react-navigation/*` deps, e2e scripts.

## References & docs consulted

- Firebase (Auth, Messaging): official docs used to confirm token storage and auth state best practices.
- Expo & Expo Notifications: official docs for notification registration and background handling.
- Expo Router: docs for file-based routing and recommended app root layout.

## Research notes: MCP browser tools & Undici

- MCP browser tools: The repository uses external MCP-provided browser tools for interactive verification; local test runners and CI-run browser jobs have been removed. When running verification in an MCP environment, prefer small, declarative verification scripts that rely on the MCP runtime to provide browsers and capture artifacts. If a CI-hosted verification is ever needed, build a static web export and serve it for the external verification tool to avoid Metro flakiness.

- Undici (Context7 ID: /nodejs/undici): undici is a high-performance HTTP client used transitively by Firebase packages. Context7 docs and undici repo tests confirm the API surface (fetch, upgrade, dispatcher) and contain security-related test fixtures. Security guidance:
	- Vulnerabilities reported by `npm audit` that list `undici` as the transitive dependency are typically resolved by upgrading `@firebase/*` or `firebase` to versions that depend on a safe undici range. Upgrading `firebase` to a patched release (or specific `@firebase/*` packages) is the recommended remediation.
	- Keep an eye on Node.js versions and bundled fetch implementation changes: newer Node LTS releases change how `undici` is used. When bumping `firebase`, re-run `npm audit` and `npm ls undici` to confirm the resolved `undici` version.

These research notes were added after consulting Context7 parsed docs and are stored here for maintainers and future audits.

## Next steps I can take (pick any or I will proceed with mine)

- Implement the low-risk fixes above and run `npm run typecheck` and E2E smoke tests locally.
- Create a small PR that: moves Firebase config to env, adds `src/constants/locationCodes.ts`, removes redundant navigation packages, and tightens TS config. I can run tests and report results.
- If you prefer only the audit, I will mark this memory update complete and wait for instructions.

---

## Recent session actions (brief)

- Migrated app routing from React Navigation to Expo Router (added `app/(tabs)` file-based routes).
- Ported Auth and Reports screens into `app/auth.tsx` and `app/reports.tsx`.
- Implemented 5 forecast tabs scaffold and created domain-specific tabs: `wind.tsx`, `waves.tsx`, `currents.tsx`, `tides.tsx`, and updated `app/(tabs)/_layout.tsx`.
- Resolved TypeScript errors in the new tab files by using local `any` casts for domain lookups and replacing `Surface` usages with plain Views to avoid react-native-paper typing mismatches.

## 🔥 HOT RELOAD PROTOCOL

### ⚠️ NEVER RESTART SERVER UNNECESSARILY
**WRONG APPROACH:**
- Stop server process
- Run `npm run web` again  
- Opens new browser tab
- Wastes time and resources

**✅ CORRECT HOT RELOAD APPROACH:**
1. **Keep server running** - Expo has hot reload built-in
2. **Make code changes** - Server automatically rebuilds
3. **Test immediately** - Use existing Playwright connection
4. **ONLY restart server** if:
	- Dependency changes (`package.json` modified)
	- Environment changes (`.env` modified)
	- Metro cache corruption (extremely rare)

### 🚀 DEVELOPMENT WORKFLOW

Start server ONCE at beginning of session

nohup npm run web > server.log 2>&1 &
Make all code changes using hot reload
No server restarts needed for:
- Component updates
- Style changes
- Logic modifications
- File additions
Test changes immediately:

playwright_navigate → http://localhost:8081
playwright_screenshot → "after-changes.png"

### 💡 HOT RELOAD BENEFITS
- **Faster development** - No server restart delays
- **Browser stays open** - No new tabs
- **State preserved** - React components maintain state
- **Instant feedback** - See changes immediately


