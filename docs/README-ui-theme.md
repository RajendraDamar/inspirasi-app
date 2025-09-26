This document describes the UI/UX theme assets added to the project.

Files added:
- `src/theme/colors.ts` - color tokens (maritime blue primary, alert colors, surfaces, elevation)
- `src/theme/typography.ts` - typography scale used across the app
- `src/theme/spacing.ts` - spacing system and radii
- `src/components/AppHeader.tsx` - non-sticky header (logo, search placeholder, profile avatar)
- `src/components/WeatherCard.tsx` - multi-variant card component (hero/alert/marine/forecast)

How to test locally:
1. Start the dev server: `npm run web` (PowerShell)
2. Open the app in the browser using the Expo URL provided by Metro (e.g. http://localhost:19006 or the Metro dev URL on port 8081).
3. Navigate through the bottom tabs (Beranda/Prakiraan/Peringatan/Laporan).
4. Home and Forecasts screens will receive deterministic mock data when BMKG is unreachable (see `src/data/mockWeatherData.ts`).

Notes:
- Icons are placeholders (text circle) in the bottom nav; replace with proper vector icons if desired.
- The WeatherCard hero uses a CSS-like linear-gradient in style; React Native does not accept that string — replace with `react-native-linear-gradient` for a production gradient.
- The header search bar is a Pressable placeholder; integrate a working search input as next step.

Next recommended UI tasks:
- Replace placeholder icons with `react-native-vector-icons` or `react-native-paper` icons.
- Implement actual gradient backgrounds using `react-native-linear-gradient`.
- Wire header search to a location lookup flow.

