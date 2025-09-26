import React from 'react';
import { ScrollView, StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import CurrentConditions from '../../../src/components/weather/CurrentConditions';
import { useWeatherData } from '../../../src/hooks/useWeatherData';
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';
import WeatherCard from '../../../src/components/WeatherCard';
import colors from '../../../src/theme/colors';
// ...existing imports above

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
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch?.();
      await marineHook.refetch?.();
    } catch (e) {
      // noop
    } finally {
      setRefreshing(false);
    }
  }, [refetch, marineHook]);

  const forecasts = (weather && (weather as any).forecasts) || [];

  if (isLoading) return (
    <View style={styles.center}><Paragraph>Loading forecasts…</Paragraph></View>
  );

  if (isError) return (
    <View style={styles.center}><Paragraph>Failed to load forecasts. Pull to refresh.</Paragraph></View>
  );

  return (
  <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ padding: 16 }}>
        <WeatherCard variant="marine" title="Cuaca Saat Ini" value={`${forecasts?.[0]?.temperature ?? '--'}°C`} subtitle={forecasts?.[0]?.weather} />

        <View style={{ height: 200, backgroundColor: colors.surfaceVariant, borderRadius: 8, marginTop: 12 }} />

        <Title style={{ marginTop: 12 }}>Daily Forecasts</Title>
        <FlatList
          data={forecasts}
          keyExtractor={(f: any, i) => String(i)}
          renderItem={({ item }) => <ForecastItem item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />

        <Title style={{ marginTop: 12 }}>Marine Summary</Title>
        <Card elevation={2} style={{ padding: 12, marginTop: 8 }}>
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
