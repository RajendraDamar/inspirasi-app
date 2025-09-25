declare module 'expo-task-manager' {
  export function defineTask(name: string, handler: (data: any) => void): void;
  export function isTaskRegisteredAsync(name: string): Promise<boolean>;
  export function unregisterAllTasksAsync(): Promise<void>;
  export type TaskManagerTask = any;
}
