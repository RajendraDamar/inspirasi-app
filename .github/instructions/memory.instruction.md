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
- E2E: There is a GitHub Actions workflow at `.github/workflows/e2e.yml` that runs Playwright but is configured as manual dispatch (`workflow_dispatch`) by maintainer preference. The repository provides `e2e` tests and an `e2e:ci` script that starts the Expo web server and runs Playwright when the server responds.
- Services & hooks live under `src/services` and `src/hooks` (examples: `bmkgService.ts`, `notificationService.ts`, `locationService.ts`, `useWeatherData.ts`, `useLocation.ts`).
- Constants: theme and colors examples and BMKG location codes are in the instructions and suggested paths (e.g., `src/constants/colors.ts`, `src/constants/locationCodes.ts`).
- Firestore rules example: public-read for weather/alerts; `reports` collection allows create only for authenticated users with `user_type == 'fisherman'`.

## Defaults and examples referenced
- Default BMKG location code shown in the instructions: `31.71.03.1001` (Jakarta Pusat).
- Theme primary colors in examples: light `#1976D2`, dark `#1565C0` (Material 3 blue variants).
- `app.json` example in instructions includes plugins: `expo-notifications`, `expo-location`, and web bundler set to `metro`.

## E2E & CI guidance (maintainer preference)
- The repo's GitHub Actions e2e workflow is manual dispatch only. Contributors should run E2E locally via the provided `e2e:ci` / `e2e` scripts or manually with Playwright.
- If CI reliability is needed later, the instructions recommend building a static web export and serving it for Playwright to test against to avoid Metro flakiness.

## E2E policy (owner preference)
- The repository owner has mandated that MCP Playwright browser tools (mcp_playwright_browser_*) are the exclusive method to run E2E tests for this project. Local terminal-based Playwright runs and CI-run Playwright jobs are intentionally disabled.
- As a result:
	- All Playwright spec files have been removed from the repository to prevent accidental execution; historical test code has been archived outside the repo when needed.
	- The GitHub Actions Playwright workflow is a no-op and must not run Playwright in automation.
	- The project `package.json` no longer lists Playwright or related terminal test runners in `devDependencies` and terminal `e2e` scripts have been removed.
	- `package-lock.json` Playwright entries have been removed/placeholdered to avoid retaining locked Playwright versions; regenerate a fresh lockfile locally with `npm install` if needed.

Use the MCP Playwright browser tools for any interactive E2E verification or automated checks run by the MCP environment. Local reproduction for debugging should be done by starting the web server and using the `?e2e=` forced-route query parameter together with the MCP Playwright browser calls.

## Security note
- Example Firebase config appears in the instructions for local/dev usage. Treat any real credentials as secrets: use environment variables or CI secret storage for production deployments. Do not publish production keys.

## Recommended next steps (from instructions)
- Keep TypeScript types strict; remove temporary `any` casts and `// @ts-ignore` where feasible and re-run `npm run typecheck`.
- Document E2E run instructions (`?e2e` usage, `npm run e2e:ci`) in README for contributors.
- Preserve the manual CI dispatch preference unless maintainers request automated PR/merge-triggered E2E runs.

---

If any part of this memory should be changed or removed, tell me which sections to update and I'll revise this file.
## Notes

- Default BMKG location code used: 3171010001 (Jakarta)

## Navigation & E2E Notes (corrected)

- Navigation: The project uses Expo Router (file-based routing). Do NOT add conflicting @react-navigation packages unless there's a specific migration reason.

## Codebase audit findings (summary)

These findings reflect a repository scan and recommendations to bring the codebase in line with the documented instructions and best practices.

- Routing duplication (High): The codebase contains Expo Router (primary) and a fallback React Navigation `AppNavigator` plus `@react-navigation/*` packages in `package.json`. This increases maintenance burden and can introduce subtle routing/integration bugs. Recommended: choose a single router (prefer Expo Router for this project), remove unused React Navigation packages, and delete or migrate the fallback navigator.

- Firebase configuration in source (Critical): `src/services/firebase/config.ts` contains an inline `firebaseConfig` object with keys. Move all real credentials to environment variables and use `process.env` (managed by `expo-constants` or `dotenv` in dev). Add `firebaseConfig` to `.env` and ensure CI secrets are used in workflows.

- Missing BMKG location constants (Medium): Instructions reference `LOCATION_CODES` (or `src/constants/locationCodes.ts`) but a constants file mapping BMKG location codes is not present. Add `src/constants/locationCodes.ts` to centralize location codes and use it across services and hooks.

- TypeScript strictness & types (Medium): `tsconfig.json` sets `strict: false` and some modules use broad `any` types. Enable stricter checks where feasible and run `npm run typecheck` as a pre-merge check. Fix `// @ts-ignore` and replace `any` with concrete interfaces for services and API responses.

- E2E workflow fragility (Low/Medium): `e2e:ci` uses `npx expo start --web` and `start-server-and-test` which can be flaky on CI because Metro dev server is not a static server. The repo's GitHub Actions uses manual dispatch which is reasonable; for automated CI consider building a static web export and serving it for Playwright tests to improve reliability.

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
	- Actions: Document local E2E steps in README; optionally add a CI pathway that builds a static web bundle and serves it for Playwright.

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

## Next steps I can take (pick any or I will proceed with mine)

- Implement the low-risk fixes above and run `npm run typecheck` and E2E smoke tests locally.
- Create a small PR that: moves Firebase config to env, adds `src/constants/locationCodes.ts`, removes redundant navigation packages, and tightens TS config. I can run tests and report results.
- If you prefer only the audit, I will mark this memory update complete and wait for instructions.

---

