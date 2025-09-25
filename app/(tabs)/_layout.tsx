import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Forecast 1' }} />
      <Tabs.Screen name="forecast2" options={{ title: 'Forecast 2' }} />
      <Tabs.Screen name="forecast3" options={{ title: 'Forecast 3' }} />
      <Tabs.Screen name="forecast4" options={{ title: 'Forecast 4' }} />
      <Tabs.Screen name="forecast5" options={{ title: 'Forecast 5' }} />
    </Tabs>
  );
}
