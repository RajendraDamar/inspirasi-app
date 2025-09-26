import React from 'react';
import { RefreshControl, StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Text, Avatar, Button } from 'react-native-paper';
import { useWeatherData } from '../../src/hooks/useWeatherData';
import useReportsData from '../../src/hooks/useReportsData';
import SkeletonCard from '../../src/components/SkeletonCard';
import ErrorState from '../../src/components/ErrorState';
import EmptyState from '../../src/components/EmptyState';

// Paper Card subcomponents may not be typed consistently across versions; create safe aliases
const CardContent: any = (Card as any).Content || ((props: any) => props.children);

const screenWidth = Dimensions.get('window').width;

function HeroCard({ weather }: { weather?: any }) {
  return (
    <Card elevation={8} style={styles.heroCard}>
      <CardContent>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Title style={{ color: '#fff' }}>{weather?.location ?? 'Unknown location'}</Title>
            <Text style={{ color: '#fff', fontSize: 32 }}>{weather?.temperature ?? '--'}°C</Text>
            <Paragraph style={{ color: '#fff' }}>{weather?.description ?? ''}</Paragraph>
          </View>
          <Avatar.Icon size={64} icon="map-marker" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        </View>
      </CardContent>
    </Card>
  );
}

function ForecastCard({ item }: { item: any }) {
  return (
    <Card style={styles.forecastCard} elevation={8}>
      <CardContent>
        <Title>{item.time ?? 'Now'}</Title>
        <Paragraph>{item.summary}</Paragraph>
        <Text>{item.temperature ?? '--'}°C</Text>
      </CardContent>
    </Card>
  );
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
            <HeroCard weather={weatherAny?.current || weatherAny?.forecasts?.[0]} />
          )}

          {/* Today's Forecast carousel */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Today's Forecast</Text>
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

          {/* Recent Alerts banner */}
          {Array.isArray(weatherAny?.alerts) && weatherAny.alerts.length ? (
            <Card style={{ margin: 16 }} elevation={8}>
              <CardContent>
                <Title>Critical Alerts</Title>
                <Paragraph>{(weatherAny.alerts || []).join('; ')}</Paragraph>
                <Button mode="contained" onPress={() => {}}>View Alerts</Button>
              </CardContent>
            </Card>
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
