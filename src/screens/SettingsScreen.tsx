
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { View, Text } from '@/components/Themed'
import { MVNavigation } from '@/types';
import Layout from '@/constants/Layout';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useDarkTheme, useDefaultTheme, useLightTheme } from '@/data/redux/reducers/theme';

type SelecetedCb = (opionIdx: number) => void;

const OptionLines = ({ optionList, onSelect }:
  { optionList: string[], onSelect: SelecetedCb }) => {

  return (
    <View style={styles.optionsContainer}>
      {optionList.map((option, idx) => {
        return (
          <Pressable onPress={() => onSelect(idx)}>
            <View style={styles.optionLine}>
              <Text style={styles.optionLineText}>{option}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export const LanguageSelection = () => {
  const langauges = ['English', 'Finnish'];

  const selected = (idx: number) => {
    console.log('Selected: ' + langauges[idx]);
  }

  return (
    <OptionLines optionList={langauges} onSelect={selected} />
  );
}

export const StyleSelection = () => {
  const dispatch = useAppDispatch();
  const styles = ['dark', 'light', 'default'];

  const selected = (idx: number) => {
    switch (idx) {
      case 0:
        dispatch(useDarkTheme());
        break;
      case 1:
        dispatch(useLightTheme());
        break;
      case 2:
        dispatch(useDefaultTheme());
        break;
      default:
        break;
    }
  }

  return (
    <OptionLines optionList={styles} onSelect={selected} />
  );
}

export const SettingsScreen = ({ navigation }: { navigation: MVNavigation }) => {
  return (
    <View style={styles.optionsContainer}>
      <Pressable onPress={() => navigation.push('StyleSelection')} >
        <View style={styles.optionLine}>
          <Text style={styles.optionLineText}>Select a style</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.push('LanguageSelection')} >
        <View style={styles.optionLine}>
          <Text style={styles.optionLineText}>Select a language</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    paddingTop: 20,
    height: Layout.window.height,
    width: '100%',
    alignContent: 'center',
  },
  optionLine: {
    width: '100%',
    paddingLeft: 20,
    height: 60,
    alignContent: 'center',
  },
  optionLineText: {
    width: '100%',
    fontSize: 30,
    borderBottomWidth: 1,
  }
});
