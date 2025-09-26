import { router, Slot, usePathname } from 'expo-router';
// react-native-paper's SegmentedButtons typing can vary between versions; import dynamically
const { SegmentedButtons }: { SegmentedButtons: any } = require('react-native-paper');
import { View } from 'react-native';

export default function ForecastsLayout() {
  const pathname = usePathname();
  const current = pathname.includes('/wind') ? 'wind' 
    : pathname.includes('/waves') ? 'waves'
    : pathname.includes('/currents') ? 'currents' 
    : pathname.includes('/tides') ? 'tides'
    : 'index';

  const buttons = [
    { value: 'cuaca', label: 'Cuaca' },
    { value: 'angin', label: 'Angin' },
    { value: 'gelombang', label: 'Gelombang' },
    { value: 'arus', label: 'Arus' },
    { value: 'pasang-surut', label: 'Pasang Surut' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <SegmentedButtons
        value={current}
        onValueChange={(value: string) => {
          // Map Indonesian values to internal routes
          const routeMap: Record<string,string> = {
            'cuaca': '/(tabs)/forecasts',
            'angin': '/(tabs)/forecasts/wind',
            'gelombang': '/(tabs)/forecasts/waves',
            'arus': '/(tabs)/forecasts/currents',
            'pasang-surut': '/(tabs)/forecasts/tides'
          };
          const target = routeMap[value] || '/(tabs)/forecasts';
          router.replace(target);
        }}
        buttons={buttons}
        style={{ margin: 16 }}
        theme={{ colors: { primary: '#1976D2' } }}
      />
      <Slot />
    </View>
  );
}
