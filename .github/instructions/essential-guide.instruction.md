# Essential Development Guide 2025

## CURRENT TECH STACK (September 2025)
- Expo SDK 53+ (minimum 51)
- React Native 0.76+
- Expo Router 4+ (file-based routing ONLY)
- React Native Paper 5.0 (Material Design 3 ONLY)
- Firebase Local Emulator (development)
- TanStack React Query v5 (no versions in package.json)
- TypeScript 5+

## DEVELOPMENT WORKFLOW
Terminal 1: `firebase emulators:start`
Terminal 2: `npm run web` (keep running, use hot reload)
Testing: Playwright MCP tools (built-in)

## ABSOLUTELY FORBIDDEN
- React Navigation (Expo Router ONLY)
- Other UI libraries (React Native Paper ONLY)
- Redux/Zustand/MobX (Context + React Query ONLY)
- Version numbers in package.json (let AI choose latest)
