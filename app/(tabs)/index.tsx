import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CurrentConditions from '../../src/components/weather/CurrentConditions';
import { useWeatherData } from '../../src/hooks/useWeatherData';

export default function Forecast1() {
  const { weather } = useWeatherData();
  const f = weather?.forecasts?.[0] || {};
  return (
    <ScrollView style={styles.container}>
      <CurrentConditions temperature={f.temperature} humidity={f.humidity} weather={f.weather} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } });
