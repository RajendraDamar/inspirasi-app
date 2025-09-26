import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import CurrentConditions from '../../src/components/weather/CurrentConditions';
import { useMarineForecast } from '../../src/hooks/useMarineForecast';

export default function Currents() {
  const { marine, isLoading } = useMarineForecast();
  const currents = marine?.currents;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.title}>Currents Summary</Text>
        {isLoading ? (
          <Text>Loading current data…</Text>
        ) : currents ? (
          <Text>Speed: {currents.speedKt} kt • Direction: {currents.directionDeg}°</Text>
        ) : (
          <Text>Current data not available for this location.</Text>
        )}
      </View>

      <CurrentConditions temperature={undefined} humidity={undefined} weather={undefined} />

      <View style={{ padding: 16 }}>
        <Text>Detailed current forecasts will be shown here (direction, speed over time).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, summary: { margin: 16 }, title: { fontSize: 18, fontWeight: '600', marginBottom: 8 } });
