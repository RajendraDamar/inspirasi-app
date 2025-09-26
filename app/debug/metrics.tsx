import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Appbar, Button, Card, Text, TextInput } from 'react-native-paper';
import performanceLogger from '../../src/services/metrics/performanceLogger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

type Metric = {
  sendTimestamp: number;
  receiveTimestamp: number;
  deliveryLatency: number;
  platform: string;
  deviceState: string;
  success: boolean;
  alertType: string;
};

const PERSIST_KEY = '@inspirasi:notification_metrics';

export default function MetricsDebugScreen() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filtered, setFiltered] = useState<Metric[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [alertFilter, setAlertFilter] = useState<string>('');
  const [startIso, setStartIso] = useState<string>('');
  const [endIso, setEndIso] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadMetrics();
    const id = setInterval(() => loadMetrics(), 3000); // refresh periodically during experiments
    return () => clearInterval(id);
  }, []);

  async function loadMetrics() {
    try {
      const data = await performanceLogger.exportLocal();
      setMetrics(data as Metric[]);
    } catch (e) {
      console.warn('Failed to load metrics', e);
    }
  }

  useEffect(() => {
    applyFilters();
  }, [metrics, platformFilter, alertFilter, startIso, endIso]);

  function applyFilters() {
    const start = startIso ? new Date(startIso).getTime() : -Infinity;
    const end = endIso ? new Date(endIso).getTime() : Infinity;
    const out = metrics.filter((m) => {
      if (platformFilter && m.platform !== platformFilter) return false;
      if (alertFilter && m.alertType !== alertFilter) return false;
      if (m.receiveTimestamp < start || m.receiveTimestamp > end) return false;
      return true;
    });
    setFiltered(out);
  }

  const stats = useMemo(() => {
    if (!filtered.length) return { count: 0, avg: 0, median: 0, successRate: 0 };
    const latencies = filtered.map((m) => m.deliveryLatency).sort((a, b) => a - b);
    const avg = latencies.reduce((s, v) => s + v, 0) / latencies.length;
    const mid = Math.floor(latencies.length / 2);
    const median = latencies.length % 2 === 1 ? latencies[mid] : (latencies[mid - 1] + latencies[mid]) / 2;
    const successRate = (filtered.filter((m) => m.success).length / filtered.length) * 100;
    return { count: filtered.length, avg, median, successRate };
  }, [filtered]);

  async function exportCsv() {
    try {
      if (!filtered.length) {
        Alert.alert('No metrics', 'There are no metrics to export for the current filter.');
        return;
      }
      const headers = ['sendTimestamp', 'receiveTimestamp', 'deliveryLatency', 'platform', 'deviceState', 'success', 'alertType'];
      const rows = filtered.map((m) => [
        new Date(m.sendTimestamp).toISOString(),
        new Date(m.receiveTimestamp).toISOString(),
        String(m.deliveryLatency),
        m.platform,
        m.deviceState,
        m.success ? '1' : '0',
        m.alertType,
      ]);
      const csv = [headers.join(',')].concat(rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))).join('\n');
      const filename = `notification-metrics-${Date.now()}.csv`;
      const path = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Exported', `CSV exported to ${path}`);
    } catch (e) {
      console.error('Failed to export CSV', e);
      Alert.alert('Error', 'Failed to export CSV');
    }
  }

  async function clearMetrics() {
    Alert.alert('Clear metrics', 'Clear local metrics? This cannot be undone locally.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(PERSIST_KEY);
            await loadMetrics();
            Alert.alert('Cleared', 'Local metrics cleared');
          } catch (e) {
            console.warn('Failed to clear metrics', e);
            Alert.alert('Error', 'Failed to clear metrics');
          }
        },
      },
    ]);
  }

  const uniquePlatforms = Array.from(new Set(metrics.map((m) => m.platform))).filter(Boolean);
  const uniqueAlerts = Array.from(new Set(metrics.map((m) => m.alertType))).filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Metrics Debug" subtitle="Notification performance data" />
        <Appbar.Action icon="download" onPress={exportCsv} accessibilityLabel="Export CSV" />
        <Appbar.Action icon="delete" onPress={clearMetrics} accessibilityLabel="Clear metrics" />
      </Appbar.Header>

      <View style={{ padding: 12 }}>
        <Card style={{ marginBottom: 12, padding: 8 }}>
          <Text variant="titleLarge">Filters</Text>
          <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput placeholder="Platform" value={platformFilter} onChangeText={setPlatformFilter} style={{ flex: 1 }} />
            <TextInput placeholder="Alert type" value={alertFilter} onChangeText={setAlertFilter} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            <TextInput placeholder="Start ISO (e.g. 2025-09-01)" value={startIso} onChangeText={setStartIso} style={{ flex: 1 }} />
            <TextInput placeholder="End ISO (e.g. 2025-09-30)" value={endIso} onChangeText={setEndIso} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
            <Button mode="contained" onPress={() => { setPlatformFilter(''); setAlertFilter(''); setStartIso(''); setEndIso(''); }}>Reset</Button>
            <Button mode="outlined" onPress={applyFilters}>Apply</Button>
          </View>
        </Card>

        <Card style={{ marginBottom: 12, padding: 8 }}>
          <Text variant="titleLarge">Statistics</Text>
          <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
          <Text>Total (filtered): {stats.count}</Text>
          <Text>Avg latency: {Math.round(stats.avg)} ms</Text>
          <Text>Median latency: {Math.round(stats.median)} ms</Text>
          <Text>Success rate: {stats.successRate.toFixed(1)} %</Text>
        </Card>

        <Card style={{ flex: 1, padding: 8 }}>
          <Text variant="titleLarge">Recent Metrics</Text>
          <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
          <FlatList
            data={filtered.slice().reverse()}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <Text>{item.alertType} • {item.platform} • {item.deliveryLatency} ms</Text>
                <Text style={{ color: '#666' }}>{new Date(item.receiveTimestamp).toISOString()}</Text>
              </View>
            )}
          />
        </Card>
      </View>
    </View>
  );
}
