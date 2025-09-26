import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
// CardContent alias to avoid react-native-paper typing mismatch in TS
const CardContent: any = (Card as any).Content || ((props: any) => props.children);
import colors from '../theme/colors';
import getAlertSeverityColor from '../theme/alert';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

type Variant = 'hero' | 'alert' | 'marine' | 'forecast' | 'report';

interface WeatherCardProps {
  variant: Variant;
  severity?: 'critical' | 'warning' | 'advisory' | 'normal';
  title?: string;
  subtitle?: string;
  value?: string | number;
  children?: React.ReactNode;
}

const LinearGradient: any = (() => {
  try {
    // dynamic require so library remains optional
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('react-native-linear-gradient').default;
  } catch (e) {
    return null;
  }
})();

/**
 * WeatherCard
 * Variants:
 * - hero: large display for current temperature and condition (supports optional LinearGradient)
 * - alert: left-colored bar indicating severity (critical/warning/advisory)
 * - marine: small summary card for wave/wind/current/tide values
 * - forecast: compact forecast card used in horizontal lists
 * - report: card layout for user reports
 *
 * Props:
 * - variant: which card variant to render
 * - severity: applies to alert variant to color the left border
 * - title/subtitle/value: text content
 */
function WeatherCard({ variant, severity = 'normal', title, subtitle, value, children }: WeatherCardProps) {
  if (variant === 'hero') {
    const content = (
      <View style={styles.heroInner}>
        <Text style={styles.heroTemp}>{value ?? '--'}°C</Text>
        <Text style={styles.heroCondition}>{subtitle}</Text>
      </View>
    );
    if (LinearGradient) {
      return (
        <LinearGradient colors={[colors.primary, '#1565C0']} style={styles.heroContainer}>
          {content}
        </LinearGradient>
      );
    }
    return (
      <View style={[styles.heroContainer, { backgroundColor: colors.primary }]}>
        {content}
      </View>
    );
  }

  if (variant === 'alert') {
    const severityMeta = getAlertSeverityColor(severity || 'normal');
    return (
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: severityMeta.color }]}> 
        <CardContent>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'marine') {
    return (
      <Card style={[styles.card]}> 
        <CardContent>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
          {children}
        </CardContent>
      </Card>
    );
  }

  // forecast and report share simple card layout
  return (
    <Card style={variant === 'forecast' ? styles.forecastCard : styles.card}>
      <CardContent>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </CardContent>
    </Card>
  );
}

export default React.memo(WeatherCard);

const styles = StyleSheet.create({
  heroContainer: {
    height: 200,
    margin: spacing.md,
    borderRadius: spacing.radiusMedium,
    padding: 24,
    justifyContent: 'center'
  },
  heroInner: { paddingHorizontal: 8 },
  heroTemp: { fontSize: 48, color: colors.onPrimary, fontWeight: '600' },
  heroCondition: { fontSize: 18, color: colors.onPrimary, marginTop: 8 },
  card: {
    marginVertical: 6,
    marginHorizontal: spacing.md,
    borderRadius: spacing.radiusMedium,
    elevation: 2,
    backgroundColor: colors.surface
  },
  forecastCard: {
    width: 80,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8
  },
  cardTitle: { fontSize: typography.titleSmall.fontSize, fontWeight: '600' },
  cardSubtitle: { fontSize: typography.bodySmall.fontSize, color: colors.onSurfaceVariant, marginTop: 6 },
  cardValue: { fontSize: 24, fontWeight: '600', marginTop: 8 }
});
