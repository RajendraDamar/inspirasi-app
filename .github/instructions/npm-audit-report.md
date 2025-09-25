# NPM Audit Report (automatically generated)

Date: 2025-09-25 (updated)

Summary (current):

- Total vulnerabilities found: 15
  - High: 5
  - Moderate: 10
  - Critical: 0

Notes:

- This audit was run after aligning several Expo-related packages to SDK-54 bundled versions and upgrading `react-native-safe-area-context` to satisfy `expo-router`.
- The remaining vulnerabilities are mostly indirect (transitive) and originate from Firebase packages (which pull in `undici`) and the React Native CLI toolchain (which pulls in `ip`).

Key vulnerable packages (observed):

- `firebase` and several `@firebase/*` packages (moderate) — these pull in `undici`.
- `undici` (moderate) — used by Firebase internals (affects crypto/randomness and DoS in some ranges).
- `ip` (high) — pulled in by `@react-native-community/cli-*` (SSRF-related advisory affecting isPublic).
- `@react-native-community/cli*` (high) — affects react-native toolchain.

Full audit metadata (summary):

```json
{"vulnerabilities":{"info":0,"low":0,"moderate":10,"high":5,"critical":0,"total":15},"dependencies":{"prod":1220,"dev":2,"optional":12,"peer":32,"peerOptional":0,"total":1265}}
```

Direct vs transitive:

- The reported `firebase` package is a direct dependency in this repo; several advisories are flagged on it or its `@firebase/*` subpackages.
- Most other flagged packages are transitive (not listed directly in `package.json`).

Fix availability:

- For many of the `@firebase/*` advisories and `undici`, fixes are available via newer releases of `firebase`/`@firebase/*` that bump `undici` to a safe range.
- For `ip` and the RN CLI advisories, the recommended fix is to upgrade `react-native` to a patched patch release that resolves the dependency chain (npm suggests `react-native@0.72.17` as a compatible fix target).

Actionable remediation plan (recommended order):

1) Patch Firebase-related paths (low-risk, high value)
   - Upgrade `firebase` to the latest non-breaking release that is compatible with your codebase (at least to the latest 10.x or 11.x release that includes fixes to `@firebase/*` and `undici`).
   - Test auth, firestore, and storage flows locally (unit or integration smoke tests).
   - Commands:

     - npm install firebase@^10.14.1 # or the latest 10.x/11.x stable that passes tests
     - npm run typecheck && npm run build (if applicable)
     - npm audit --omit=dev

2) Address `ip` / RN CLI advisories (medium-risk)
   - The RN CLI chain can be updated by upgrading `react-native` patch version (npm suggests `0.72.17`). Upgrading RN has runtime and native implications — treat this as a separate PR with device/emulator smoke tests.
   - If patching React Native is not currently feasible, document the risk and schedule a follow-up upgrade window.

3) If upgrading RN is not possible immediately, consider narrowing the attack surface
   - The advisories affect the developer toolchain (RN CLI). They don't directly impact app runtime on user devices, but they can affect CI and developer machines. Make sure CI runners are trusted and limit who can run arbitrary builds.

4) Re-run audits and iterate
   - After each dependency bump, run:

     ```powershell
     npm install
     npm run typecheck
     npm audit --omit=dev --json > .github/instructions/npm-audit-report-latest.json
     ```

5) Avoid `--legacy-peer-deps` as a permanent solution
   - We aligned Expo packages to SDK-54 bundled versions so installs succeed without forcing legacy peer resolution. If future installs require `--legacy-peer-deps`, treat it as a temporary workaround and prefer upgrading the conflicting peer packages.

6) Create small, targeted PRs
   - One PR to upgrade `firebase` and test.
   - One PR (separate) to upgrade `react-native`/RN CLI if desired, with detailed testing steps.

Notes on priority:

- Upgrade `firebase` first because it's a direct dependency and fixes will reduce many transitive vulnerabilities.
- Upgrading `react-native` is higher risk - schedule it with native dev time and device testing.

Files and commands used during this audit:

- npm audit --omit=dev --json (this run produced the summary above)
- package.json and package-lock.json were updated locally during dependency alignment to Expo SDK-54 versions

Next steps I will take if you want me to continue (I can proceed automatically):

- Attempt to upgrade `firebase` to the latest 10.x/11.x patch that resolves `undici` and re-run the audit.
- If audit still reports `ip` via RN CLI, propose a `react-native` patch bump PR and include migration notes.
- Commit the audit report update and open a PR with the dependency changes and verification steps.

If you'd like me to continue, I'll proceed to upgrade `firebase` safely and re-run the audit, then create the PR. If you prefer a different priority (for example, upgrade RN first), tell me and I'll follow that order.
