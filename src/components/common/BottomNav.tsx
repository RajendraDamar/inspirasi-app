import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Surface and useTheme are exported differently across RN Paper versions; import the module and access members safely
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const Surface = rnp.Surface || rnp.default?.Surface || ((props: any) => props.children ?? null);
const useTheme = rnp.useTheme || rnp.default?.useTheme || (() => ({ colors: { primary: '#4285F4', backdrop: '#e0e0e0' } }));
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type RouteDescriptor = {
  name: string;
  key: string;
  options?: any;
};

type Props = {
  state: {
    index: number;
    routes: RouteDescriptor[];
  };
  descriptors: Record<string, any>;
  navigation: any;
};

export default function BottomNav(props?: Props) {
  const theme = useTheme();

  // Standalone mode: if no navigator props provided, render a simple visual bar
  if (!props) {
    const routes = [
      { name: 'Home' },
      { name: 'Reports' },
      { name: 'Library' },
      { name: 'Settings' },
    ];

    return (
      <Surface style={[styles.container, { borderTopColor: theme.colors.backdrop }]}
        accessibilityRole="navigation">
        {routes.map((route) => {
          const color = theme.colors.primary;
          const iconName = route.name === 'Home' ? 'home' : route.name === 'Reports' ? 'file-document' : route.name === 'Library' ? 'apps' : 'account';
          const onPress = () => {
            try {
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('e2e', route.name.toLowerCase());
                window.location.href = url.toString();
              }
            } catch (e) {
              // no-op
            }
          };

          const node = (
            <View style={styles.tab}>
              <TouchableOpacity onPress={onPress} style={styles.touchable} testID={`bottomtab-${route.name.toLowerCase()}`}>
                <MaterialCommunityIcons name={iconName as string} size={28} color={color} />
                <Text style={[styles.label, { color }]}>{route.name}</Text>
              </TouchableOpacity>
            </View>
          );

          return React.cloneElement(node as any, { key: route.name });
        })}
      </Surface>
    );
  }

  const { state, descriptors, navigation } = props;

  return (
    <Surface style={[styles.container, { borderTopColor: theme.colors.backdrop }]} accessibilityRole="navigation">
      {state.routes.map((route, idx) => {
        const focused = state.index === idx;
        const label = descriptors[route.key]?.options?.title || route.name;
        const color = focused ? theme.colors.primary : '#6b6b6b';
        const iconName = route.name === 'Home' ? 'home' : route.name === 'Reports' ? 'file-document' : route.name === 'Library' ? 'apps' : 'account';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const node = (
          <View style={styles.tab}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
              testID={`bottomtab-${route.name.toLowerCase()}`}
              onPress={onPress}
              style={styles.touchable}
            >
              <MaterialCommunityIcons name={iconName as string} size={28} color={color} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </TouchableOpacity>
          </View>
        );

        return React.cloneElement(node as any, { key: route.key });
      })}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 4,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
