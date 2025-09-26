import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import dataSyncManager from '../src/services/sync/dataSyncManager';
import locationService from '../src/services/location/locationService';
import AuthContext from '../src/contexts/AuthContext';

const ReportsScreen = () => {
  const ctx = useContext(AuthContext) as any;
  const { user } = ctx || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async () => {
    const loc = await locationService.getCurrentLocation();
    const report = {
      authorId: user?.uid || 'anon',
      title,
      description,
      timestamp: Date.now(),
      location: loc,
    };
    await dataSyncManager.queueReport(report);
    setTitle('');
    setDescription('');
    alert('Laporan disimpan offline dan akan disinkronisasi saat online.');
  };

  return (
    <View style={styles.container}>
      <Title>Buat Laporan Nelayan</Title>
      <TextInput label="Judul" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput label="Deskripsi" value={description} onChangeText={setDescription} style={styles.input} multiline />
      <Button mode="contained" onPress={submit} style={styles.button}>Kirim Laporan</Button>
      <Paragraph>Data akan dikirim ketika perangkat kembali online.</Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, input: { marginBottom: 12 }, button: { marginTop: 8 } });

export default ReportsScreen;
