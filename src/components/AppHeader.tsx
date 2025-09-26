import React from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import { useLocation } from '../contexts/LocationContext';
import LOCATION_CODES, { BANTUL_PANTAI_DEPOK } from '../constants/locationCodes';

interface AppHeaderProps {
  showSearch?: boolean;
  showBack?: boolean;
  title?: string;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export default function AppHeader({ showSearch = true, showBack = false, title = '', onSearchPress, onProfilePress }: AppHeaderProps) {
  const { setLocationCode } = useLocation();
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState('');

  const commit = () => {
    const t = text.trim().toLowerCase();
    // quick mapping: if user types 'bantul' or 'depok' map to Bantul code
    if (t.includes('bantul') || t.includes('depok')) {
      setLocationCode(BANTUL_PANTAI_DEPOK);
    } else if (t.includes('jakarta')) {
      setLocationCode(LOCATION_CODES.JAKARTA_PUSAT || LOCATION_CODES['Jakarta'] || '3171010001');
    }
    setEditing(false);
    setText('');
  };

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.logo}>🌊 <Text style={styles.logoText}>INSPIRASI</Text></Text>
      </View>

      {showSearch ? (
        editing ? (
          <TextInput
            style={styles.searchInput}
            value={text}
            onChangeText={setText}
            placeholder="Cari lokasi..."
            onSubmitEditing={commit}
            onBlur={() => setEditing(false)}
            returnKeyType="search"
          />
        ) : (
          <Pressable style={styles.searchContainer} onPress={() => setEditing(true)} accessibilityRole="search">
            <Text style={styles.searchPlaceholder}>Cari lokasi...</Text>
          </Pressable>
        )
      ) : (
        <View style={styles.titleContainer}><Text style={styles.titleText}>{title}</Text></View>
      )}

      <Pressable style={styles.right} onPress={onProfilePress} accessibilityRole="button">
        <Avatar.Text size={36} label="U" style={styles.avatar} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2
  },
  left: { width: 140 },
  logo: { fontSize: 18, fontWeight: '600', color: colors.primary },
  logoText: { color: colors.primary, fontWeight: '600' },
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#F2F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 8
  },
  searchPlaceholder: { color: '#8A8A8A' },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F2F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8
  },
  titleContainer: { flex: 1, alignItems: 'center' },
  titleText: { fontSize: typography.titleMedium.fontSize, fontWeight: '600' },
  right: { width: 48, alignItems: 'flex-end' },
  avatar: { backgroundColor: '#E3F2FD' }
});
