import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Weather' }} />
      <Tabs.Screen name="wind" options={{ title: 'Wind' }} />
      <Tabs.Screen name="waves" options={{ title: 'Waves' }} />
      <Tabs.Screen name="currents" options={{ title: 'Currents' }} />
      <Tabs.Screen name="tides" options={{ title: 'Tides' }} />
    </Tabs>
  );
}
