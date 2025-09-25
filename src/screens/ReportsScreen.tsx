import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import dataSyncManager from '../services/sync/dataSyncManager';
import locationService from '../services/location/locationService';
import AuthContext from '../contexts/AuthContext';

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
      <TextInput
        label="Judul"
        accessibilityLabel="Judul"
        testID="input-judul"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Deskripsi"
        accessibilityLabel="Deskripsi"
        testID="input-deskripsi"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Button
        mode="contained"
        onPress={submit}
        accessibilityLabel="Kirim Laporan"
        testID="button-kirim-laporan"
      >
        Kirim Laporan
      </Button>
      <Paragraph>Data akan dikirim ketika perangkat kembali online.</Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, input: { marginBottom: 12 } });

export default ReportsScreen;
