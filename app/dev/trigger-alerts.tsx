import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { evaluateAndEmitAlerts } from '../../src/services/notifications/alertEvaluator';
import { Button } from 'react-native-paper';

export default function TriggerAlertsScreen() {
  const [log, setLog] = useState<string[]>([]);

  const append = (s: string) => setLog((l) => [s, ...l]);

  async function runDemo() {
    append('Starting demo alert evaluation...');
    const cities = [
      { code: '3171010001', name: 'Jakarta Pusat' },
      { code: '3573010001', name: 'Surabaya' },
    ];

    for (const c of cities) {
      append(`Evaluating ${c.name} (${c.code})`);
      try {
        const res = await evaluateAndEmitAlerts({ cityCode: c.code, cityName: c.name });
        append(`Result for ${c.name}: ${JSON.stringify(res)}`);
      } catch (e) {
        append(`Error for ${c.name}: ${String(e)}`);
      }
    }
  }

  useEffect(() => {
    // Auto-run when ?auto=1 is present so MCP/HTTP can trigger evaluation
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const sp = new URLSearchParams(window.location.search);
        if (sp.get('auto') === '1') runDemo();
      }
    } catch (e) {
      // ignore in native environments
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Button mode="contained" onPress={runDemo} style={{ marginBottom: 12 }}>
        Run Demo Alert Evaluation
      </Button>
      <View style={{ gap: 8 }}>
        {log.map((l, i) => (
          <Text key={i} style={{ marginBottom: 6 }}>{l}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
