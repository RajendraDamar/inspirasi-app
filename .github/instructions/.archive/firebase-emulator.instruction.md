````markdown
## Firebase Local Emulator - Quickstart

This project supports running against the Firebase Local Emulator for safe local development.

Prerequisites
- Node.js and npm installed
- Firebase CLI available (recommended: install globally `npm i -g firebase-tools`)

Start emulators
1. From the project root run:

```bash
firebase emulators:start
```

2. Open the Emulator UI at http://localhost:4000 to inspect Auth/Firestore/Storage.

Run the app
1. In another terminal start the web dev server:

```bash
npm run web
```

Notes
- The app auto-connects to the local emulators when `NODE_ENV=development` or when `EXPO_USE_FIREBASE_EMULATOR=true`.
- Emulator ports are configured in `firebase.json` (auth:9099, firestore:8080, storage:9199).
- For production builds, ensure `EXPO_USE_FIREBASE_EMULATOR` is not set.

````
