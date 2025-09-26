# Firebase Local Emulator Setup

## QUICK START

firebase init emulators # Select: Auth, Firestore, Storage
firebase emulators:start # Port 4000 for UI

## AUTO-CONNECTION
App automatically connects to local emulator when:
- `NODE_ENV=development`, OR  
- `EXPO_USE_FIREBASE_EMULATOR=true`

## EMULATOR PORTS
- Auth: 9099
- Firestore: 8080  
- Storage: 9199
- UI Dashboard: 4000

## BENEFITS
- No security concerns (local only)
- Fast development (no network)
- Perfect for prototype/thesis
