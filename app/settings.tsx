import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// guarded imports for react-native-paper to handle varying export shapes
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Text: any = rnp.Text || rnp.default?.Text || ((props: any) => null);
const Button: any = rnp.Button || rnp.default?.Button || ((props: any) => null);
const Switch: any = rnp.Switch || rnp.default?.Switch || ((props: any) => null);
const RadioButton: any = rnp.RadioButton || rnp.default?.RadioButton || ((props: any) => null);
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
      <View style={styles.section}>
        <Text variant="titleLarge">User Profile</Text>
  <List.Item title={auth?.user?.displayName || 'Guest'} description={auth?.user?.email || ''} />
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Language</Text>
        <RadioButton.Group
          onValueChange={(v: string) => setLocal({ ...local, language: v })}
          value={local.language}
        >
          <RadioButton.Item label="Bahasa Indonesia" value="id" />
          <RadioButton.Item label="English" value="en" />
        </RadioButton.Group>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Notifications</Text>
  <View style={styles.row}><Text>Push</Text><Switch value={!!local.notifications?.push} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, push: v } })} /></View>
  <View style={styles.row}><Text>Email</Text><Switch value={!!local.notifications?.email} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, email: v } })} /></View>
  <View style={styles.row}><Text>SMS</Text><Switch value={!!local.notifications?.sms} onValueChange={(v: boolean) => setLocal({ ...local, notifications: { ...local.notifications, sms: v } })} /></View>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Theme</Text>
  <RadioButton.Group onValueChange={(v: string) => setLocal({ ...local, theme: v })} value={local.theme}>
          <RadioButton.Item label="Light" value="light" />
          <RadioButton.Item label="Dark" value="dark" />
          <RadioButton.Item label="System" value="system" />
        </RadioButton.Group>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Data & Location</Text>
  <TextInput label="Refresh interval (minutes)" keyboardType="numeric" value={String(local.refreshIntervalMinutes)} onChangeText={(t: string) => setLocal({ ...local, refreshIntervalMinutes: Number(t) || 0 })} />
  <TextInput label="Default location code" value={local.defaultLocationCode || ''} onChangeText={(t: string) => setLocal({ ...local, defaultLocationCode: t })} />
  <View style={styles.row}><Text>Use GPS</Text><Switch value={!!local.useGps} onValueChange={(v: boolean) => setLocal({ ...local, useGps: v })} /></View>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Data Sources & Cache</Text>
  <TextInput label="BMKG API endpoint" value={local.bmkgApiEndpoint || ''} onChangeText={(t: string) => setLocal({ ...local, bmkgApiEndpoint: t })} />
  <TextInput label="Cache duration (minutes)" keyboardType="numeric" value={String(local.cacheDurationMinutes)} onChangeText={(t: string) => setLocal({ ...local, cacheDurationMinutes: Number(t) || 0 })} />
  <View style={styles.row}><Text>Offline mode</Text><Switch value={!!local.offlineMode} onValueChange={(v: boolean) => setLocal({ ...local, offlineMode: v })} /></View>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="titleLarge">Security</Text>
  <List.Item title={`Signed in: ${auth?.user ? 'Yes' : 'No'}`} />
  {auth?.user ? <Button mode="outlined" onPress={() => auth.logout()}>Sign out</Button> : null}
      </View>

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
