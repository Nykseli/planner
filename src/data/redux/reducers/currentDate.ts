import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@/data/redux/store';

import { IDateInfo, DateInfo } from '@/data/dataObjects';

export interface CurrentDateState {
  date: IDateInfo,
  status: 'idle' | 'loading' | 'failed',
}

// Start with the current day on default
const initialState: CurrentDateState = {
  date: DateInfo.today().serialize(),
  status: 'idle',
};

export const dateSlice = createSlice({
  name: 'currentDate',
  initialState,
  reducers: {
    nextDate: (state) => {
      state.date = DateInfo.toNextDay(state.date).serialize();
    },
    previousDate: (state) => {
      state.date = DateInfo.toPreviousDay(state.date).serialize();
    },
    currentDate: (state) => {
      state.date = DateInfo.today().serialize();
    }
  }
});

export const { nextDate, previousDate, currentDate } = dateSlice.actions;

export const selectDate = (state: RootState) => state.currentDate.date

export default dateSlice.reducer;
