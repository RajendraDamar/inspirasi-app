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
    { value: 'index', label: 'Weather' },
    { value: 'wind', label: 'Wind' },
    { value: 'waves', label: 'Waves' },
    { value: 'currents', label: 'Currents' },
    { value: 'tides', label: 'Tides' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <SegmentedButtons
        value={current}
        onValueChange={(value: string) => 
          router.replace(`/(tabs)/forecasts/${value === 'index' ? '' : value}`)
        }
        buttons={buttons}
        style={{ margin: 16 }}
      />
      <Slot />
    </View>
  );
}
