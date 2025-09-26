import React from 'react';
import { View, StyleSheet } from 'react-native';
// guarded import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Text: any = rnp.Text || rnp.default?.Text || ((p: any) => null);
const Button: any = rnp.Button || rnp.default?.Button || ((p: any) => null);

export default function EmptyState({ title, description, action }: { title?: string; description?: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{title || 'No items'}</Text>
      {description ? <Text>{description}</Text> : null}
      {action ? <Button mode="contained" onPress={action.onPress}>{action.label}</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
});
