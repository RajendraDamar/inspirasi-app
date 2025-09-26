// Use guarded requires for react-native-paper export shape compatibility
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnp = require('react-native-paper');
const MD3LightTheme = (rnp && rnp.MD3LightTheme) || rnp.default?.MD3LightTheme || rnp.default || {};
const MD3DarkTheme = (rnp && rnp.MD3DarkTheme) || rnp.default?.MD3DarkTheme || rnp.default || {};

export const lightTheme: any = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...(MD3LightTheme.colors || {}),
    primary: '#1976D2',
    primaryContainer: '#D1E4FF',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onSurface: '#1F1F1F',
    error: '#B3261E',
  },
};

export const darkTheme: any = {
  ...MD3DarkTheme,
  roundness: 12,
  colors: {
    ...(MD3DarkTheme.colors || {}),
    primary: '#90CAF9',
    primaryContainer: '#0D47A1',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#1E1E1E',
    onPrimary: '#001A43',
    onSurface: '#E5E5E5',
    error: '#F2B8B5',
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const elevation = { level0: 0, level1: 1, level2: 3, level3: 6, level4: 8 } as const;

export default { lightTheme, darkTheme, spacing, elevation };
