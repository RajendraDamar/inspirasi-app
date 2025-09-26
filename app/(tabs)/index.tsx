import React from 'react';
import { RefreshControl, StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Text, Avatar, Button } from 'react-native-paper';
import { useWeatherData } from '../../src/hooks/useWeatherData';
import WeatherCard from '../../src/components/WeatherCard';
import useReportsData from '../../src/hooks/useReportsData';
import SkeletonCard from '../../src/components/SkeletonCard';
import ErrorState from '../../src/components/ErrorState';
import EmptyState from '../../src/components/EmptyState';

// Paper Card subcomponents may not be typed consistently across versions; create safe aliases
const CardContent: any = (Card as any).Content || ((props: any) => props.children);

const screenWidth = Dimensions.get('window').width;

function ForecastCard({ item }: { item: any }) {
  return <WeatherCard variant="forecast" title={item.time || new Date(item.datetime).toLocaleTimeString()} subtitle={item.weather} />;
}

export default function HomeScreen() {
  const { weather, isLoading, isError, error, refetch: refetchWeather } = useWeatherData();
  const weatherAny: any = weather;
  const reportsQuery = useReportsData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchWeather?.();
      await reportsQuery.refetch?.();
    } catch (e) {
      // noop
    } finally {
      setRefreshing(false);
    }
  }, [refetchWeather, reportsQuery]);

  const forecasts = weatherAny?.forecasts?.slice(0, 6) || [];

  return (
    <FlatList
      data={reportsQuery.data || []}
      keyExtractor={(r: any) => r.id}
      ListHeaderComponent={() => (
        <View style={styles.container}>
          {/* Hero */}
          {isLoading ? (
            <SkeletonCard />
          ) : isError ? (
            <ErrorState message={String(error?.message || 'Failed to load weather')} onRetry={() => refetchWeather?.()} />
          ) : (!weatherAny || !weatherAny.forecasts || !weatherAny.forecasts.length) ? (
            <EmptyState title="No weather data" description="No weather data available" />
          ) : (
            <WeatherCard
              variant="hero"
              title={`${weatherAny.location?.village || ''}, ${weatherAny.location?.city || ''}`}
              subtitle={weatherAny.forecasts?.[0]?.weather}
              value={String(weatherAny.forecasts?.[0]?.temperature)}
            />
          )}

          {/* Today's Forecast carousel */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Prakiraan Hari Ini</Text>
            <FlatList
              horizontal
              data={forecasts}
              keyExtractor={(f: any, i) => String(i)}
              renderItem={({ item }) => <ForecastCard item={item} />}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Marine 2x2 grid */}
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            <Text style={styles.sectionTitle}>Kondisi Laut</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <View style={{ width: '48%' }}>
                <WeatherCard variant="marine" title="Gelombang" value={`${weatherAny.marine?.waveHeight ?? '--'} m`}>
                  <Paragraph>{weatherAny.marine?.waveCategory}</Paragraph>
                </WeatherCard>
              </View>
              <View style={{ width: '48%' }}>
                <WeatherCard variant="marine" title="Angin" value={`${weatherAny.marine?.windSpeed ?? '--'} m/s`}>
                  <Paragraph>{weatherAny.marine?.visibility}</Paragraph>
                </WeatherCard>
              </View>
              <View style={{ width: '48%' }}>
                <WeatherCard variant="marine" title="Arus" value={`${weatherAny.marine?.currents?.speed ?? '--'} m/s`}>
                  <Paragraph>{weatherAny.marine?.currents?.direction}</Paragraph>
                </WeatherCard>
              </View>
              <View style={{ width: '48%' }}>
                <WeatherCard variant="marine" title="Pasang Surut" value={`H:${new Date(weatherAny.marine?.tide?.nextHigh).toLocaleTimeString()}`}>
                  <Paragraph>L:{new Date(weatherAny.marine?.tide?.nextLow).toLocaleTimeString()}</Paragraph>
                </WeatherCard>
              </View>
            </View>
          </View>

          {/* Recent Alerts banner */}
          {Array.isArray(weatherAny?.marine?.warnings) && weatherAny.marine.warnings.length ? (
            <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
              <Text style={styles.sectionTitle}>Peringatan</Text>
              {(weatherAny.marine.warnings || []).map((a: any) => (
                <WeatherCard key={a.id} variant="alert" severity={a.severity} title={a.title} subtitle={a.message} />
              ))}
            </View>
          ) : null}

          {/* Latest Reports preview */}
          <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
            <Text style={styles.sectionTitle}>Latest Reports</Text>
            {reportsQuery.isLoading ? (
              <Paragraph>Loading reports…</Paragraph>
            ) : (
              (reportsQuery.data || []).slice(0, 5).map((r: any) => (
                <Card key={r.id} style={{ marginTop: 8 }} elevation={8}>
                  <CardContent>
                    <Title>{r.title || 'Report'}</Title>
                    <Paragraph numberOfLines={2}>{r.description}</Paragraph>
                    <Text style={{ marginTop: 8, color: '#666' }}>{new Date(r.createdAt?.seconds ? r.createdAt.seconds * 1000 : r.createdAt || Date.now()).toLocaleString()}</Text>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <Card style={{ marginHorizontal: 16, marginBottom: 8 }} elevation={8}>
          <CardContent>
            <Title>{item.title || 'Report'}</Title>
            <Paragraph numberOfLines={2}>{item.description}</Paragraph>
          </CardContent>
        </Card>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<EmptyState title="No reports" description="No reports yet." />}
    />
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  heroCard: { margin: 16, backgroundColor: '#1976D2', borderRadius: 12 },
  forecastCard: { width: Math.min(140, screenWidth * 0.35), margin: 8 },
  sectionTitle: { fontSize: 18, marginLeft: 16, fontWeight: '600' },
});
