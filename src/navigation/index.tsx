import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import NotFoundScreen from '@/screens/NotFoundScreen';
import { RootStackParamList } from '@/types';
import BottomTabNavigator from './BottomTabNavigator';
import {
  StyleSelectionNavigator,
  SettingsScreenNavigator,
  LanguageSelectionNavigator
} from './SettingsNavigator';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectTheme } from '@/data/redux/reducers/theme';
import useColorScheme from '@/hooks/useColorScheme';
import { View } from '@/components/Themed';

const Navigation = () => {
  const sTheme = useColorScheme();
  const uTheme = useAppSelector(selectTheme);
  const theme = uTheme !== 'default' ? uTheme : sTheme;
  const selectedTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    // Wrapping NavigationContainer inside of view with backgroundColor
    // gets rid of white flickering when navigating while in dark mode
    <View style={{flex: 1, backgroundColor: selectedTheme.colors.background}}>
      <NavigationContainer
        theme={selectedTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreenNavigator} />
      <Stack.Screen name="StyleSelection" component={StyleSelectionNavigator} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

export default Navigation;
