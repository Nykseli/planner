import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/data/redux/store';


export interface ThemeState {
  // default means that the system wide theme is used
  theme: 'dark' | 'light' | 'default';
}

const initialState = {
  // Use system wide theme as by default
  theme: 'default',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    useDarkTheme: (state) => {
      state.theme = 'dark';
    },
    useLightTheme: (state) => {
      state.theme = 'light';
    },
    useDefaultTheme: (state) => {
      state.theme = 'default';
    }
  }
});


export const { useDarkTheme, useLightTheme, useDefaultTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.theme;

export default themeSlice.reducer;
