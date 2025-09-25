import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Settings() {
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Settings</Text>
        <Text style={{ marginTop: 8 }}>Preferences (units, offline sync, notifications) will be added here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } });
