import React from 'react';
import { View, StyleSheet } from 'react-native';
// guarded import to tolerate different react-native-paper export shapes
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Surface: any = rnp.Surface || rnp.default?.Surface || ((p: any) => <View {...p} />);

export default function SkeletonCard({ style }: { style?: any }) {
  return (
    <Surface style={[styles.surface, style]}>
      <View style={styles.line} />
      <View style={[styles.line, { width: '60%' }]} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: { padding: 12, borderRadius: 8, backgroundColor: '#eee', marginVertical: 8 },
  line: { height: 12, backgroundColor: '#ddd', borderRadius: 6, marginVertical: 6 },
});
