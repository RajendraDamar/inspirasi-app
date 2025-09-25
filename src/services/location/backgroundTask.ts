import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'INSPIRASI_BACKGROUND_LOCATION_TASK';

// Define the background task - it will receive location updates
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: any[] };
    // Here you could persist the locations to AsyncStorage or trigger sync
    console.log(`Background locations received: ${locations?.length}`);
    // For now, just store the last location using expo-location storage logic elsewhere
  }
});
