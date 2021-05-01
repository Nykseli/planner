import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/data/redux/store';

import { Locale } from '@/util/i18n/locale';
import Language from '@/util/i18n';


export interface LocaleState {
  locale: Locale;
}

const initialState = {
  locale: Language.en,
}

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    useEnLocale: (state) => {
      state.locale = Language.en;
    },
    useFiLocale: (state) => {
      state.locale = Language.fi;
    },
  }
});


export const { useEnLocale, useFiLocale } = localeSlice.actions;
export const selectLocale = (state: RootState) => state.locale.locale;

export default localeSlice.reducer;
