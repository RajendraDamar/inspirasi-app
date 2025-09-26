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
        <List.Item title={auth?.user?.displayName || 'Guest'} description={auth?.user?.email || ''} left={() => <List.Icon icon="account" />} />
      </List.Section>

      <Divider />

      <List.Section title="Preferences" style={styles.section}>
        <SegmentedButtons
          value={local.theme}
          onValueChange={(v: any) => setLocal({ ...local, theme: v })}
          buttons={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]}
        />

        <View style={{ marginTop: 12 }}>
          <Text>Language</Text>
          <SegmentedButtons
            value={local.language}
            onValueChange={(v: any) => setLocal({ ...local, language: v })}
            buttons={[{ value: 'id', label: 'Bahasa' }, { value: 'en', label: 'English' }]}
          />
        </View>
      </List.Section>

      <Divider />

      <List.Section title="Notifications" style={styles.section}>
        <List.Item title="Push" right={() => <Switch value={!!local.notifications?.push} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, push: v } })} />} />
        <List.Item title="Email" right={() => <Switch value={!!local.notifications?.email} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, email: v } })} />} />
        <List.Item title="SMS" right={() => <Switch value={!!local.notifications?.sms} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, sms: v } })} />} />
      </List.Section>

      <Divider />

      <List.Section title="Data & Location" style={styles.section}>
        <TextInput label="Refresh interval (minutes)" keyboardType="numeric" value={String(local.refreshIntervalMinutes)} onChangeText={(t: string) => setLocal({ ...local, refreshIntervalMinutes: Number(t) || 0 })} />
        <TextInput label="Default location code" value={local.defaultLocationCode || ''} onChangeText={(t: string) => setLocal({ ...local, defaultLocationCode: t })} />
        <List.Item title="Use GPS" right={() => <Switch value={!!local.useGps} onValueChange={(v: boolean) => setLocal({ ...local, useGps: v })} />} />
      </List.Section>

      <Divider />

      <List.Section title="Data Sources & Cache" style={styles.section}>
        <TextInput label="BMKG API endpoint" value={local.bmkgApiEndpoint || ''} onChangeText={(t: string) => setLocal({ ...local, bmkgApiEndpoint: t })} />
        <TextInput label="Cache duration (minutes)" keyboardType="numeric" value={String(local.cacheDurationMinutes)} onChangeText={(t: string) => setLocal({ ...local, cacheDurationMinutes: Number(t) || 0 })} />
        <List.Item title="Offline mode" right={() => <Switch value={!!local.offlineMode} onValueChange={(v: boolean) => setLocal({ ...local, offlineMode: v })} />} />
      </List.Section>

      <Divider />

      <List.Section title="Security" style={styles.section}>
        <List.Item title={`Signed in: ${auth?.user ? 'Yes' : 'No'}`} />
        {auth?.user ? <Button mode="outlined" onPress={() => auth.logout()}>Sign out</Button> : null}
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
