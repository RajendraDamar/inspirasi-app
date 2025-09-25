## Summary

This PR aligns Expo-related dependencies to SDK-54 bundled versions, tightens TypeScript compiler options, migrates Firebase config to environment variables, updates notification handler types, and updates the npm audit report produced after the changes.

## Changes

- Bumped several `expo-*` packages to their SDK-54 bundled versions
- Bumped `react-native-safe-area-context` to ^5.4.0 to satisfy `expo-router` peer
- Enabled `noImplicitAny` and `strictNullChecks` in `tsconfig.json` and fixed any type errors that appeared
- Refactored `src/services/firebase/config.ts` to read configuration from environment variables
- Added `.env.example` documenting required env variables
- Updated `src/services/notifications/pushNotifications.ts` to satisfy NotificationBehavior
- Updated `.github/instructions/npm-audit-report.md` with current audit results and remediation plan

## Verification steps

1. npm install
2. npm run typecheck
3. npm audit --omit=dev --json > .github/instructions/npm-audit-report-latest.json
4. Manual smoke test: expo start -> verify basic screens load

Note: running `npx expo prebuild --no-install` failed in this workspace due to an image MIME/parsing error from `jimp` while processing app icons. Please verify image assets in `assets/` (PNG files) are valid; re-encode if needed. This prebuild failure does not block JS-level verification but will affect native builds.

## Next steps / Follow-up PRs

- Upgrade `firebase` to a patched 10.x/11.x release to resolve `undici` transitive CVEs
- Plan and schedule a `react-native` patch upgrade (0.72.x -> 0.72.17) to mitigate RN CLI `ip` advisory

Please review and let me know if you'd like me to proceed with the firebase upgrade and follow-up PRs.
