import React from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { useWeatherData } from '../../src/hooks/useWeatherData';
import WeatherCard from '../../src/components/WeatherCard';

const severityOrder: Record<string, number> = { critical: 0, warning: 1, advisory: 2, normal: 3 };

export default function AlertsScreen() {
  const { weather, isLoading, refetch } = useWeatherData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try { await refetch?.(); } catch (e) { }
    finally { setRefreshing(false); }
  }, [refetch]);
  const warnings = (weather as any)?.marine?.warnings || [];

  const sorted = [...warnings].sort((a: any, b: any) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

  return (
  <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ padding: 16 }}>
        <Title>Peringatan</Title>
        {isLoading ? (
          <Paragraph>Memuat peringatan…</Paragraph>
        ) : !sorted.length ? (
          <Paragraph>Tidak ada peringatan saat ini.</Paragraph>
        ) : (
          sorted.map((w: any) => (
            <WeatherCard key={w.id} variant="alert" severity={w.severity} title={`${w.title} — ${w.area || ''}`} subtitle={`${w.message} • ${new Date(w.timestamp).toLocaleString()}`} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } });
