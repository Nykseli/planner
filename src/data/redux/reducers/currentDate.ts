import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@/data/redux/store';

import { IDateInfo, DateInfo } from '@/data/dataObjects';
import { fetchDailyTasksAsync } from './dailyTasks';

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

// TODO: dispatch and getstate types
export const nextDateWithTasks = (): AppThunk => (dispatch, getState) => {
  // First get the next date
  dispatch(nextDate());
  // After we've generated the next date, get the tasks for it asynchronously
  const nextdate = selectDate(getState());
  dispatch(fetchDailyTasksAsync(nextdate));
}

// TODO: dispatch and getstate types
export const previousDateWithTasks = (): AppThunk => (dispatch, getState) => {
  // First get the next date
  dispatch(previousDate());
  // After we've generated the previous date, get the tasks for it asynchronously
  const previousdate = selectDate(getState());
  dispatch(fetchDailyTasksAsync(previousdate));
}

export const selectDate = (state: RootState) => state.currentDate.date

export default dateSlice.reducer;
