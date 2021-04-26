import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import dateReducer from '@/data/redux/reducers/currentDate'

export const store = configureStore({
  reducer: {
    currentDate: dateReducer
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
