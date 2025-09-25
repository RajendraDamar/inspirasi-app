import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
const CardContent: any = (Card as any).Content || ((props: any) => props.children);

const CurrentConditions = ({ temperature, humidity, weather }: any) => {
  return (
    <Card style={styles.card}>
      <CardContent>
        <Title>{temperature ?? '--'}°C</Title>
        <Paragraph>{weather ?? 'N/A'}</Paragraph>
        <Paragraph>Kelembapan: {humidity ?? '--'}%</Paragraph>
        {weather && weather.location ? (
          <>
            <Title>{weather.location}</Title>
            <Paragraph>{weather.description}</Paragraph>
          </>
        ) : null}
      </CardContent>

    </Card>
  );
};

const styles = StyleSheet.create({
  card: { margin: 16 }
});

export default CurrentConditions;
