import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
const { List }: { List: any } = require('react-native-paper');
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';

export default function Currents() {
  const { marine, isLoading } = useMarineForecast();
  const currents = marine?.currents;

  const CardContent: any = (Card as any).Content || ((props: any) => <>{props.children}</>);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <List.Item title="Currents Summary" description={isLoading ? 'Loading current data…' : currents ? `Speed: ${currents.speedKt} kt • Direction: ${currents.directionDeg}°` : 'Current data not available for this location.'} left={(props: any) => <List.Icon {...props} icon="current-ac" />} />
        </CardContent>
      </Card>

      <Card style={{ margin: 16 }}>
        <CardContent>
          <List.Item title="Details" description="Detailed current forecasts will be shown here (direction, speed over time)." />
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
