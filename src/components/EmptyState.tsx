import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function EmptyState({ title, description, action }: { title?: string; description?: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>{title || 'Nothing here'}</Text>
      {description ? <Text>{description}</Text> : <Text>{'No items to show.'}</Text>}
      {action ? <Button mode="contained" onPress={action.onPress} style={styles.button}>{action.label}</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  title: { marginBottom: 8 },
  button: { marginTop: 12 },
});
