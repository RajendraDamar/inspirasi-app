import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// guarded imports for react-native-paper to handle varying export shapes
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Text: any = rnp.Text || rnp.default?.Text || ((props: any) => null);
const Button: any = rnp.Button || rnp.default?.Button || ((props: any) => null);
const Switch: any = rnp.Switch || rnp.default?.Switch || ((props: any) => null);
const SegmentedButtons: any = rnp.SegmentedButtons || rnp.default?.SegmentedButtons || ((props: any) => null);
const TextInput: any = rnp.TextInput || rnp.default?.TextInput || ((props: any) => null);
const List: any = rnp.List || rnp.default?.List || ((props: any) => null);
const Divider: any = rnp.Divider || rnp.default?.Divider || ((props: any) => null);
const useTheme: any = rnp.useTheme || rnp.default?.useTheme || (() => ({ colors: { background: '#fff' } }));

import { useSettings, SettingsProvider } from '../src/contexts/SettingsContext';
import AuthContext from '../src/contexts/AuthContext';

function SettingsForm() {
  const { prefs, loading, save } = useSettings();
  const auth = useContext(AuthContext);
  const theme = useTheme();

  const [local, setLocal] = useState<any>(null);

  useEffect(() => {
    if (prefs) setLocal(prefs);
  }, [prefs]);

  if (loading || !local) return <Text style={{ padding: 16 }}>Loading settings...</Text>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section title="Account" style={styles.section}>
        <List.Item
          title={auth?.user?.displayName || 'Guest'}
          description={auth?.user?.email || ''}
          left={() => <List.Icon icon="account" />}
        />
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text variant="bodyMedium">{auth?.user?.role || 'User'}</Text>
        </View>
      </List.Section>

      <Divider />

      <List.Section title="Preferences" style={styles.section}>
        <List.Item title="Theme" description="App theme preference" />
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <SegmentedButtons
            value={local.theme}
            onValueChange={(v: any) => setLocal({ ...local, theme: v })}
            buttons={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]}
          />
        </View>

        <List.Item title="Language" description={local.language === 'id' ? 'Bahasa' : 'English'} />
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <SegmentedButtons
            value={local.language}
            onValueChange={(v: any) => setLocal({ ...local, language: v })}
            buttons={[{ value: 'id', label: 'Bahasa' }, { value: 'en', label: 'English' }]}
          />
        </View>

        <List.Item title="Location" description={local.defaultLocationCode || 'Not set'} right={() => <Button onPress={() => {}}>Change</Button>} />
      </List.Section>

      <Divider />

      <List.Section title="Notifications" style={styles.section}>
        <List.Item
          title="Weather alerts"
          right={() => <Switch value={!!local.notifications?.alerts} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, alerts: v } })} />}
        />
        <List.Item
          title="Critical only"
          right={() => <Switch value={!!local.notifications?.criticalOnly} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, criticalOnly: v } })} />}
        />
      </List.Section>

      <Divider />

      <List.Section title="Data Privacy & Cache" style={styles.section}>
        <List.Item title="Clear cached data" description="Remove offline caches and local DB" right={() => <Button mode="outlined" onPress={() => { /* implement clear cache */ }}>Clear</Button>} />
        <List.Item title="Privacy policy" right={() => <Button onPress={() => { /* open policy */ }}>Open</Button>} />
        <List.Item title="Offline mode" right={() => <Switch value={!!local.offlineMode} onValueChange={(v: boolean) => setLocal({ ...local, offlineMode: v })} />} />
      </List.Section>

      <Divider />

      <List.Section title="Data Sources" style={styles.section}>
        <TextInput label="BMKG API endpoint" value={local.bmkgApiEndpoint || ''} onChangeText={(t: string) => setLocal({ ...local, bmkgApiEndpoint: t })} />
        <TextInput label="Cache duration (minutes)" keyboardType="numeric" value={String(local.cacheDurationMinutes)} onChangeText={(t: string) => setLocal({ ...local, cacheDurationMinutes: Number(t) || 0 })} />
      </List.Section>

      <View style={{ padding: 16 }}>
        <Button mode="contained" onPress={async () => { await save(local); }}>Save preferences</Button>
      </View>
    </ScrollView>
  );
}

export default function SettingsScreen() {
  return (
    <SettingsProvider>
      <SettingsForm />
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
});
