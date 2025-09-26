// Re-export the raw App component from expo-router's qualified entry
// instead of `expo-router/entry` which registers a root component as a
// side-effect. Importing the qualified entry prevents double registration
// of the React root when the native `expo` AppEntry also registers the app.
import { App } from 'expo-router/build/qualified-entry';
export default App;
