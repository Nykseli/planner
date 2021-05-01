
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { View, Text } from '@/components/Themed'
import { MVNavigation } from '@/types';
import Layout from '@/constants/Layout';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useDarkTheme, useDefaultTheme, useLightTheme } from '@/data/redux/reducers/theme';
import { selectLocale, useEnLocale, useFiLocale } from '@/data/redux/reducers/locale';

type SelecetedCb = (opionIdx: number) => void;

const OptionLines = ({ optionList, onSelect }:
  { optionList: string[], onSelect: SelecetedCb }) => {

  return (
    <View style={styles.optionsContainer}>
      {optionList.map((option, idx) => {
        return (
          <Pressable key={idx} onPress={() => onSelect(idx)}>
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
  const locale = useAppSelector(selectLocale).settings;
  const dispatch = useAppDispatch();
  const langauges = [locale.languageEn, locale.languageFi];

  const selected = (idx: number) => {
    switch (idx) {
      case 0:
        dispatch(useEnLocale());
        break;
      case 1:
        dispatch(useFiLocale());
        break;
      default:
        break;
    }
  }

  return (
    <OptionLines optionList={langauges} onSelect={selected} />
  );
}

export const StyleSelection = () => {
  const locale = useAppSelector(selectLocale).settings;
  const dispatch = useAppDispatch();
  const styles = [locale.styleDark, locale.styleLight, locale.styleDefault];

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
  const locale = useAppSelector(selectLocale).ui;

  return (
    <View style={styles.optionsContainer}>
      <Pressable onPress={() => navigation.push('StyleSelection')} >
        <View style={styles.optionLine}>
          <Text style={styles.optionLineText}>{locale.styleSelection}</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.push('LanguageSelection')} >
        <View style={styles.optionLine}>
          <Text style={styles.optionLineText}>{locale.languageSelection}</Text>
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
