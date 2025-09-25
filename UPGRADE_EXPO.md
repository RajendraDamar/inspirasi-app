Upgrade plan for Expo/tooling

Goal
- Move the project toward a modern Expo SDK and aligned React/React Native versions.

Background
- Current repo: expo ^54.0.0, react 18.2.0, react-native ^0.72.17
- Expo SDKs are tied to specific React Native versions; newer RN often needs newer React.

Proposed approach (safe, staged)
1. Draft and review: create this document and branch with plan (current).
2. Choose target SDK: recommend Expo SDK 53 or 54 (both modern). SDK 53 maps to RN ~0.79, SDK 54 maps to RN 0.81.
   - Moving to SDK 53 will require updating react-native and possibly react if RN's peer requires it.
3. Test locally on a branch: update dependencies in `package.json` in small steps, run `npm install`, `npm audit`, `tsc --noEmit`.
4. Smoke test: `npx expo start`, `npx expo prebuild` (if needed), `npx expo run:android` in a dev machine or CI.
5. If all good, commit, push, and open PR with detailed verification notes and rollback steps.

Commands (example)
- Create branch: git checkout -b chore/upgrade-expo-sdk
- Update package.json: bump `expo`, `react`, `react-native` to chosen versions
- Install: npm install
- Run: npx expo install (for Expo-managed packages), npx pod-install (on macOS), npm run typecheck, npm audit
- Start dev: npx expo start

Rollback
- If install or runtime errors occur, revert the package.json changes and lockfile, then re-open for smaller-step upgrades.

Notes
- I will not force peer deps with --force without first trying a coordinated upgrade.
- If you want me to proceed with the full coordinated upgrade now, confirm and I'll proceed to update package.json and run installs.

Generated on: 2025-09-25
