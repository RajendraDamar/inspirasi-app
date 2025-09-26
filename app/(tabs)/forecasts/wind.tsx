import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';
import { useWeatherData } from '../../../src/hooks/useWeatherData';
import WeatherCard from '../../../src/components/WeatherCard';
import colors from '../../../src/theme/colors';
import { FlatList } from 'react-native';

export default function Wind() {
  const { marine, isLoading } = useMarineForecast();

  const wind = marine?.wind;

  const { weather } = useWeatherData();

  const CardContent: any = (Card as any).Content || ((props: any) => <>{props.children}</>);

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 16 }}>
        <WeatherCard variant="marine" title="Angin Saat Ini" value={wind ? `${wind.speedKt ?? '--'} kt` : '--'}>
          <Paragraph>{wind ? `Arah: ${wind.directionDeg ?? '—'}°` : 'Tidak tersedia'}</Paragraph>
        </WeatherCard>

        {/* Map placeholder */}
        <View style={{ height: 200, backgroundColor: colors.surfaceVariant, borderRadius: 8, marginTop: 12 }} />

        <Title style={{ marginTop: 12 }}>Hourly Wind Forecast</Title>
        <FlatList
          data={(weather as any)?.forecasts || []}
          keyExtractor={(i: any, idx) => String(idx)}
          renderItem={({ item }) => (
            <Card style={{ marginTop: 8 }}>
              <CardContent>
                <Title>{new Date(item.datetime).toLocaleString()}</Title>
                <Paragraph>Speed: {item.windSpeed ?? '--'} m/s • Direction: {item.windDirection ?? '—'}</Paragraph>
              </CardContent>
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
