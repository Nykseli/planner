import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/data/redux/store';

import { IMonthInfo, MonthInfo } from '@/data/dataObjects';

export interface CurrentMonthState {
  month: IMonthInfo,
  status: 'idle' | 'loading' | 'failed',
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

export const selectMonth = (state: RootState) => state.currentMonth.month;

export default monthSlice.reducer;
