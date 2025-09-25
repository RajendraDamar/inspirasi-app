import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
const { List }: { List: any } = require('react-native-paper');
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';

export default function Waves() {
  const { marine, isLoading } = useMarineForecast();
  const waves = marine?.waves;

  const CardContent: any = (Card as any).Content || ((props: any) => <>{props.children}</>);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <List.Item title="Waves Summary" description={isLoading ? 'Loading wave data…' : waves ? `Height: ${waves.heightM} m${waves.periodS ? ` • Period: ${waves.periodS}s` : ''}` : 'Wave data not available for this location.'} left={(props: any) => <List.Icon {...props} icon="wave" />} />
        </CardContent>
      </Card>

      <Card style={{ margin: 16 }}>
        <CardContent>
          <List.Item title="Details" description="Detailed wave forecasts will be shown here (period, direction, height over time)." />
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
