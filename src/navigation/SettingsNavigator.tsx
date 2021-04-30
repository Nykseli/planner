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


const SettingsStack = createStackNavigator<SettingsScreenParamList>();
export const SettingsScreenNavigator = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
    </SettingsStack.Navigator>
  );
}

const LanguageSelectionStack = createStackNavigator<LanguageSelectionParamList>();
export const LanguageSelectionNavigator = () => {
  return (
    <LanguageSelectionStack.Navigator>
      <LanguageSelectionStack.Screen
        name='LanguageSelection'
        component={LanguageSelection}
        options={{ headerTitle: "Language selection" }}
      />
    </LanguageSelectionStack.Navigator>
  );
}

const StyleSelectionStack = createStackNavigator<StyleSelectionParamList>();
export const StyleSelectionNavigator = () => {
  return (
    <StyleSelectionStack.Navigator>
      <StyleSelectionStack.Screen
        name='StyleSelection'
        component={StyleSelection}
        options={{ headerTitle: "Style selection" }}
      />
    </StyleSelectionStack.Navigator>
  );
}
