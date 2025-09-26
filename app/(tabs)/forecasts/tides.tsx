import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
const { List }: { List: any } = require('react-native-paper');
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';

export default function Tides() {
  const { marine, isLoading } = useMarineForecast();
  const tides = marine?.tides;

  const CardContent: any = (Card as any).Content || ((props: any) => <>{props.children}</>);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <List.Item title="Tides Summary" description={isLoading ? 'Loading tide data…' : tides && tides.length ? `Next tide: ${tides[0].timeISO} • ${tides[0].heightM} m` : 'Tide data not available for this location.'} left={(props: any) => <List.Icon {...props} icon="water" />} />
        </CardContent>
      </Card>

      <Card style={{ margin: 16 }}>
        <CardContent>
          <List.Item title="Details" description="Detailed tide forecasts will be shown here (high/low times and heights)." />
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
