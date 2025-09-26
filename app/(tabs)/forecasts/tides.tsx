import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
const { List }: { List: any } = require('react-native-paper');
import { useMarineForecast } from '../../../src/hooks/useMarineForecast';
import { useWeatherData } from '../../../src/hooks/useWeatherData';
import WeatherCard from '../../../src/components/WeatherCard';
import colors from '../../../src/theme/colors';
import { View, FlatList } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

export default function Tides() {
  const { marine, isLoading } = useMarineForecast();
  const tides = marine?.tides;
  const { weather } = useWeatherData();

  const CardContent: any = (Card as any).Content || ((props: any) => <>{props.children}</>);

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 16 }}>
        <WeatherCard variant="marine" title="Pasang Surut" value={tides && tides.length ? `Next H: ${new Date(tides[0].timeISO).toLocaleTimeString()}` : '--'}>
          <Paragraph>{tides && tides.length ? `Next L: ${new Date(tides[1]?.timeISO || Date.now()).toLocaleTimeString()}` : 'Tidak tersedia'}</Paragraph>
        </WeatherCard>

        <View style={{ height: 200, backgroundColor: colors.surfaceVariant, borderRadius: 8, marginTop: 12 }} />

        <Title style={{ marginTop: 12 }}>Tide Events</Title>
        <FlatList
          data={tides || []}
          keyExtractor={(i: any, idx) => String(idx)}
          renderItem={({ item }) => (
            <Card style={{ marginTop: 8 }}>
              <CardContent>
                <Title>{new Date(item.timeISO).toLocaleString()}</Title>
                <Paragraph>Height: {item.heightM} m • Type: {item.type || '—'}</Paragraph>
              </CardContent>
            </Card>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, card: { margin: 16 } });
