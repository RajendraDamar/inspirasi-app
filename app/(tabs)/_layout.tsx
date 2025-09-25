import React, { useMemo } from 'react';
import { Slot, useRouter } from 'expo-router';
import { View } from 'react-native';
// Paper BottomNavigation typing can be strict between versions; import as any to avoid build breaks
const { BottomNavigation, Text } = require('react-native-paper') as any;

export default function TabsLayout() {
  const router = useRouter();

  const routes = useMemo(
    () => [
      { key: 'home', title: 'Home', route: '/(tabs)/index' },
      { key: 'forecasts', title: 'Forecasts', route: '/(tabs)/forecasts' },
      { key: 'library', title: 'Library', route: '/(tabs)/library' },
    ],
    []
  );

  const [index, setIndex] = React.useState(0);

  const renderScene = ({ route }: { route: any }) => {
    // Scenes are placeholders — navigation is handled by router.replace on index change
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{route.title}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    // When index changes, navigate to the route
    const r = routes[index];
    if (r) router.replace(r.route);
  }, [index, router, routes]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ elevation: 8 }}
      />
    </View>
  );
}
