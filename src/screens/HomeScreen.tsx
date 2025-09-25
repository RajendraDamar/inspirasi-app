import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
const CardContent: any = (Card as any).Content || ((props: any) => props.children);
import { useWeatherData } from '../hooks/useWeatherData';
import CurrentConditions from '../components/weather/CurrentConditions';

const HomeScreen = () => {
  const { weather, isLoading, isError, refetch } = useWeatherData();

  if (isLoading && !weather) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Paragraph>Memuat data cuaca...</Paragraph>
      </View>
    );
  }

  if (isError && !weather) {
    return (
      <View style={styles.center}>
        <Title>Gagal Memuat Data</Title>
        <Paragraph>Periksa koneksi internet Anda</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.locationCard}>
        <CardContent>
          <Title>{weather?.location?.city || 'Jakarta'}</Title>
          <Paragraph>{weather?.location?.province || 'Indonesia'}</Paragraph>
        </CardContent>
      </Card>

      {weather && (
        <CurrentConditions
          temperature={weather.forecasts[0]?.temperature}
          humidity={weather.forecasts[0]?.humidity}
          weather={weather.forecasts[0]?.weather}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  locationCard: { margin: 16 }
});

export default HomeScreen;
