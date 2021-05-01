import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import dateReducer from '@/data/redux/reducers/currentDate'
import monthReducer from '@/data/redux/reducers/currentMonth'
import alertReducer from '@/data/redux/reducers/userAlert'
import themeReducer from '@/data/redux/reducers/theme'
import localeReducer from '@/data/redux/reducers/locale'

export const store = configureStore({
  reducer: {
    currentDate: dateReducer,
    currentMonth: monthReducer,
    userAlert: alertReducer,
    theme: themeReducer,
    locale: localeReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
