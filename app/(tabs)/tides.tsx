import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import CurrentConditions from '../../src/components/weather/CurrentConditions';
import { useMarineForecast } from '../../src/hooks/useMarineForecast';

export default function Tides() {
  const { marine, isLoading } = useMarineForecast();
  const tides = marine?.tides;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.title}>Tides Summary</Text>
        {isLoading ? (
          <Text>Loading tide data…</Text>
        ) : tides && tides.length ? (
          <Text>Next tide: {tides[0].timeISO} • {tides[0].heightM} m</Text>
        ) : (
          <Text>Tide data not available for this location.</Text>
        )}
      </View>

      <CurrentConditions temperature={undefined} humidity={undefined} weather={undefined} />

      <View style={{ padding: 16 }}>
        <Text>Detailed tide forecasts will be shown here (high/low times and heights).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, summary: { margin: 16 }, title: { fontSize: 18, fontWeight: '600', marginBottom: 8 } });
