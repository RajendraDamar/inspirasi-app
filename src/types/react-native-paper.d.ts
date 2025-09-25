declare module 'react-native-paper' {
  import * as React from 'react';
  import { ViewProps, TextProps } from 'react-native';

  export const Provider: React.ComponentType<any>;
  export const Card: React.ComponentType<any> & { Content?: React.ComponentType<any> };
  export const Title: React.ComponentType<any>;
  export const Paragraph: React.ComponentType<any>;
  export const ActivityIndicator: React.ComponentType<any>;
  export const Button: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Colors: any;
  export const Appbar: any;
  export const Banner: React.ComponentType<any>;
  export const Avatar: any;
  export const Chip: any;
  export default {} as any;
}
