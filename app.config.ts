import 'dotenv/config';

export default ({ config }: { config: any }) => ({
  ...config,
  experiments: { typedRoutes: true },
  expo: {
    name: process.env.EXPO_APP_NAME || 'inspirasi-app',
    slug: process.env.EXPO_SLUG || 'inspirasi-app',
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY || null,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
      // keep current or additional extra fields
    }
  }
});
