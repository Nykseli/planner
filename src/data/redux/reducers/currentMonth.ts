import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { IMonthInfo, MonthInfo } from '@/data/dataObjects';
import { fetchTasksAsync } from './montlyTasks';

export interface CurrentMonthState {
  month: IMonthInfo;
  status: 'idle' | 'loading' | 'failed';
}

// Start with the current month by default
const initialState: CurrentMonthState = {
  month: MonthInfo.thisMonth().serialize(),
  status: 'idle',
};

export const monthSlice = createSlice({
  name: 'currentMonth',
  initialState,
  reducers: {
    nextMonth: (state) => {
      state.month = MonthInfo.toNextMonth(state.month).serialize();
    },
    previousMonth: (state) => {
      state.month = MonthInfo.toPreviousMonth(state.month).serialize();
    },
    currentMonth: (state) => {
      state.month = MonthInfo.thisMonth().serialize();
    }
  }
});

export const { nextMonth, previousMonth, currentMonth } = monthSlice.actions;

// TODO: dispatch and getstate types
export const nextMonthWithTasks = (): AppThunk => (dispatch, getState) => {
  // First get the next month
  dispatch(nextMonth());
  // After we've generated the next month, get the tasks for it asynchronously
  const nextmonth = selectMonth(getState());
  dispatch(fetchTasksAsync(nextmonth));
}

// TODO: dispatch and getstate types
export const previousMonthWithTasks = (): AppThunk => (dispatch, getState) => {
  // First get the next month
  dispatch(previousMonth());
  // After we've generated the previous month, get the tasks for it asynchronously
  const previousmonth = selectMonth(getState());
  dispatch(fetchTasksAsync(previousmonth));
}

export const selectMonth = (state: RootState) => state.currentMonth.month;

export default monthSlice.reducer;
