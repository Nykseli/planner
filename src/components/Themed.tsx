
import * as React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput
} from 'react-native';
import {
  Ionicons as DIonIcons,
  AntDesign as DAntDesign,
  Feather as DFeather,
  MaterialIcons as DMaterialIcons
} from '@expo/vector-icons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';


import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { selectTheme } from '@/data/redux/reducers/theme'
import { useAppSelector } from '@/hooks/reduxHooks';

const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) => {
  // use system theme if user hasn't set the theme
  const sTheme = useColorScheme();
  const uTheme = useAppSelector(selectTheme);
  const theme = uTheme !== 'default' ? uTheme : sTheme;
  const colorFromProps = getKeyValue(props, theme as 'dark' | 'light');

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme as 'dark' | 'light'][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type TextProps = ThemeProps & DefaultText['props'];
type ViewProps = ThemeProps & DefaultView['props'];
type TextInputProps = ThemeProps & DefaultTextInput['props'];

const Text = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, borderColor }, style]} {...otherProps} />;
}

const TextInput = (props: TextInputProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultTextInput style={[{ color, borderColor }, style]} {...otherProps} />;
}

const View = (props: ViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultView style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}

const AntDesign = (props: IconProps<any>) => {
  const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  return <DAntDesign color={color} {...props} />
}

const Feather = (props: IconProps<any>) => {
  const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  return <DFeather color={color} {...props} />
}

const MaterialIcons = (props: IconProps<any>) => {
  const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  return <DMaterialIcons color={color} {...props} />
}

const Ionicons = (props: IconProps<any>) => {
  const color = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  return <DIonIcons color={color} {...props} />
}


export {
  Text,
  TextInput,
  View,
  Ionicons,
  AntDesign,
  Feather,
  MaterialIcons,
  TextProps,
  ViewProps,
  useThemeColor,
}
