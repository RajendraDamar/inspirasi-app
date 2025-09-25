import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function Library() {
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Library</Text>
        <Text style={{ marginTop: 8 }}>Reports archive and public feeds will appear here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } });
