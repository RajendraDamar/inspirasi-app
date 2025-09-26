import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Something went wrong</Text>
      <Text>{message || 'An unexpected error occurred.'}</Text>
      {onRetry ? <Button mode="contained" onPress={onRetry} style={styles.button}>Retry</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  title: { marginBottom: 8 },
  button: { marginTop: 12 },
});
