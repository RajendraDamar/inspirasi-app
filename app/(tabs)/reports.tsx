import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
const FAB: any = (() => {
  try { return require('react-native-paper').FAB; } catch (e) { try { return require('react-native-paper').default?.FAB; } catch { return (props: any) => null; } }
})();

const CardContent: any = (Card as any).Content || ((props: any) => props.children);

const sampleReports = [
  { id: 'r1', title: 'Kapal kecil kesulitan', description: 'Laporan dari nelayan: mesin mati, butuh bantuan.' },
  { id: 'r2', title: 'Jalur berbahaya', description: 'Terumbu muncul saat surut, hati-hati' }
];

export default function ReportsScreen() {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={{ padding: 16 }}>
        <Title>Laporan Komunitas</Title>
      </View>

      <FlatList
        data={sampleReports}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <CardContent>
              <Title>{item.title}</Title>
              <Paragraph>{item.description}</Paragraph>
            </CardContent>
          </Card>
        )}
      />

  <FAB icon="plus" style={styles.fab} onPress={() => { /* open composer */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  fab: { position: 'absolute', right: 16, bottom: 24 }
});
