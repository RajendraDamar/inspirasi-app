import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useMarineForecast } from '../../src/hooks/useMarineForecast';

export default function Wind() {
  const { marine, isLoading } = useMarineForecast();

  const wind = marine?.wind;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.card, { padding: 12 }]}>
        <Title style={{ marginBottom: 8 }}>Wind Summary</Title>
        {isLoading ? (
          <Paragraph>Loading wind data…</Paragraph>
        ) : wind ? (
          <Paragraph>Speed: {wind.speedKt} kt • Direction: {wind.directionDeg}°</Paragraph>
        ) : (
          <Paragraph>Wind data not available for this location.</Paragraph>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text>Detailed wind forecasts will be shown here (3-hour slots).</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
