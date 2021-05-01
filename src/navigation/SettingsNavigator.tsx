/**
 * Navigations for different settings screens
 */

import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import {
  LanguageSelectionParamList,
  SettingsScreenParamList,
  StyleSelectionParamList
} from '@/types';
import { LanguageSelection, SettingsScreen, StyleSelection } from '@/screens/SettingsScreen';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectLocale } from '@/data/redux/reducers/locale';


const SettingsStack = createStackNavigator<SettingsScreenParamList>();
export const SettingsScreenNavigator = () => {
  const locale = useAppSelector(selectLocale).ui;

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{ headerTitle: locale.settings }}
      />
    </SettingsStack.Navigator>
  );
}

const LanguageSelectionStack = createStackNavigator<LanguageSelectionParamList>();
export const LanguageSelectionNavigator = () => {
  const locale = useAppSelector(selectLocale).ui;

  return (
    <LanguageSelectionStack.Navigator>
      <LanguageSelectionStack.Screen
        name='LanguageSelection'
        component={LanguageSelection}
        options={{ headerTitle: locale.languageSelection }}
      />
    </LanguageSelectionStack.Navigator>
  );
}

const StyleSelectionStack = createStackNavigator<StyleSelectionParamList>();
export const StyleSelectionNavigator = () => {
  const locale = useAppSelector(selectLocale).ui;

  return (
    <StyleSelectionStack.Navigator>
      <StyleSelectionStack.Screen
        name='StyleSelection'
        component={StyleSelection}
        options={{ headerTitle: locale.styleSelection }}
      />
    </StyleSelectionStack.Navigator>
  );
}
