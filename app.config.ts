import 'dotenv/config';

export default ({ config }: { config: any }) => ({
  ...config,
  experiments: { typedRoutes: true },
  expo: {
    name: process.env.EXPO_APP_NAME || 'inspirasi-app',
    slug: process.env.EXPO_SLUG || 'inspirasi-app',
    plugins: ['expo-router'],
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/icon.png',
    },
    backgroundColor: process.env.EXPO_BACKGROUND_COLOR || '#F5F5F5',
    themeColor: process.env.EXPO_THEME_COLOR || '#1976D2',
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY || null,
      // public key for web builds and runtime access; prefer EXPO_PUBLIC_* for web-safe values
      publicFirebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_FIREBASE_API_KEY || null,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
      // keep current or additional extra fields
    }
  }
});
