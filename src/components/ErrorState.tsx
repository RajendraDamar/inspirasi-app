import React from 'react';
import { View, StyleSheet } from 'react-native';
// guarded import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Text: any = rnp.Text || rnp.default?.Text || ((p: any) => null);
const Button: any = rnp.Button || rnp.default?.Button || ((p: any) => null);

export default function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Something went wrong</Text>
      <Text>{message || 'Unable to load data.'}</Text>
      {onRetry ? <Button mode="contained" onPress={onRetry}>Retry</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
});
