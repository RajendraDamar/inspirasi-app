import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import CurrentConditions from '../../src/components/weather/CurrentConditions';
import { useMarineForecast } from '../../src/hooks/useMarineForecast';

export default function Waves() {
  const { marine, isLoading } = useMarineForecast();
  const waves = marine?.waves;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.title}>Waves Summary</Text>
        {isLoading ? (
          <Text>Loading wave data…</Text>
        ) : waves ? (
          <Text>Height: {waves.heightM} m {waves.periodS ? `• Period: ${waves.periodS}s` : ''}</Text>
        ) : (
          <Text>Wave data not available for this location.</Text>
        )}
      </View>

      <CurrentConditions temperature={undefined} humidity={undefined} weather={undefined} />

      <View style={{ padding: 16 }}>
        <Text>Detailed wave forecasts will be shown here (period, direction, height over time).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, summary: { margin: 16 }, title: { fontSize: 18, fontWeight: '600', marginBottom: 8 } });
