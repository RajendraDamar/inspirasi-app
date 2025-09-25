// Google Play / Material-inspired color palette
// Primary: Google Blue, Accent: Google Green
const brand = {
  primary: '#4285F4', // Google Blue
  accent: '#0F9D58', // Google Green
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#202124',
  disabled: '#BDBDBD',
  placeholder: '#757575'
};

export const lightTheme: any = {
  colors: {
    primary: brand.primary,
    secondary: brand.accent,
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: brand.error,
    text: brand.text,
    disabled: brand.disabled,
    placeholder: brand.placeholder,
    onPrimary: brand.onPrimary,
    // keep legacy accent for older components
    accent: brand.accent
  },
  roundness: 6,
  animation: { scale: 1.0 }
};

export const darkTheme: any = {
  colors: {
    primary: brand.primary,
    secondary: brand.accent,
    background: '#121212',
    surface: '#121212',
    error: brand.error,
    text: '#FFFFFF',
    disabled: '#424242',
    placeholder: '#9E9E9E',
    onPrimary: brand.onPrimary,
    accent: brand.accent
  },
  roundness: 6,
  animation: { scale: 1.0 }
};

export default { lightTheme, darkTheme };
