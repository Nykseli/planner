import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import NotFoundScreen from '@/screens/NotFoundScreen';
import { RootStackParamList } from '@/types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import {
  StyleSelectionNavigator,
  SettingsScreenNavigator,
  LanguageSelectionNavigator
} from './SettingsNavigator';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectTheme } from '@/data/redux/reducers/theme';
import useColorScheme from '@/hooks/useColorScheme';

const Navigation = () => {
  const sTheme = useColorScheme();
  const uTheme = useAppSelector(selectTheme);
  const theme = uTheme !== 'default' ? uTheme : sTheme;

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
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
