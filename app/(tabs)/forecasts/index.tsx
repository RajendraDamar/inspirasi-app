import React from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import CurrentConditions from '../../../src/components/weather/CurrentConditions';
import { useWeatherData } from '../../../src/hooks/useWeatherData';
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';

// Card subcomponent alias to work around type mismatches in some react-native-paper versions
const CardContent: any = (Card as any).Content || ((props: any) => props.children);

function ForecastItem({ item }: { item: any }) {
  return (
    <Card style={styles.card} elevation={2}>
      <CardContent>
        <Title>{item.datetime || item.time || 'Unknown'}</Title>
        <Paragraph>{item.weather || item.summary || ''}</Paragraph>
        <Text>{item.temperature ?? '--'}°C</Text>
      </CardContent>
    </Card>
  );
}

export default function ForecastIndex() {
  const { weather, isLoading, isError, refetch } = useWeatherData();
  const marineHook = useMarineForecast();

  const forecasts = (weather && (weather as any).forecasts) || [];

  if (isLoading) return (
    <View style={styles.center}><Paragraph>Loading forecasts…</Paragraph></View>
  );

  if (isError) return (
    <View style={styles.center}><Paragraph>Failed to load forecasts. Pull to refresh.</Paragraph></View>
  );

  return (
    <ScrollView style={styles.container} refreshControl={undefined}>
      <CurrentConditions temperature={forecasts?.[0]?.temperature} humidity={forecasts?.[0]?.humidity} weather={forecasts?.[0]?.weather} />

      <View style={{ padding: 16 }}>
        <Title>Daily Forecasts</Title>
        <FlatList
          data={forecasts}
          keyExtractor={(f: any, i) => String(i)}
          renderItem={({ item }) => <ForecastItem item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>

      <View style={{ padding: 16 }}>
        <Title>Marine Summary</Title>
        <Card elevation={2} style={{ padding: 12 }}>
          <CardContent>
            <Paragraph>Wave Height: {marineHook.marine?.waves?.heightM ?? '—'} m</Paragraph>
            <Paragraph>Wind: {marineHook.marine?.wind?.speedKt ?? '—'} kt</Paragraph>
            <Paragraph>Currents: {marineHook.marine?.currents?.speedKt ?? '—'} kt</Paragraph>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginVertical: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }
});
