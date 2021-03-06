import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { IDailyTask, IMonthViewTask, IMonthInfo, MonthInfo } from '@/data/dataObjects';
import { fetchMontlyTasks } from '@/data/api'

export type MonthTaskList = IMonthViewTask[] | null[];

export interface CurrentMonthState {
  month: IMonthInfo;
  tasks: MonthTaskList;
  status: 'unitinitalized' | 'idle' | 'loading' | 'failed';
}

// Start with the current month by default
const initialState: CurrentMonthState = {
  month: MonthInfo.thisMonth().serialize(),
  tasks: [],
  // Status refers to the loading of the tasks data.
  // month is always generated locally.
  status: 'unitinitalized',
};

export const fetchTasksAsync = createAsyncThunk(
  'monthlyTasks/fetchTasks',
  async (month: IMonthInfo) => {
    const response = await fetchMontlyTasks(month);
    // The value we return becomes the `fulfilled` action payload
    // If fetch fails it's handeled by fetchTasksAsync.rejected
    return response.monthlyTasks;
  }
);

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
    },
    addDailyToTasks: (state, action: PayloadAction<IDailyTask>) => {
      const tDate = action.payload.date;
      if (tDate.month == state.month.month && tDate.year == state.month.year) {
        // Dates are 1-31 but task list is 0 indexed
        const dateIdx = tDate.date - 1;
        const tasks = state.tasks[dateIdx] ?? { taskCount: 0 };
        tasks.taskCount += 1;
        state.tasks[dateIdx] = tasks;

      }
    },
    removeDailyFromTasks: (state, action: PayloadAction<IDailyTask>) => {
      const tDate = action.payload.date;
      if (tDate.month == state.month.month && tDate.year == state.month.year) {
        // Dates are 1-31 but task list is 0 indexed
        const dateIdx = tDate.date - 1;
        // Make sure that date has 0 tasks if for some reason we
        // try to update a date that's not defined.
        const tasks = state.tasks[dateIdx] ?? { taskCount: 1 };

        tasks.taskCount -= 1;
        state.tasks[dateIdx] = tasks;
      }
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder.addCase(fetchTasksAsync.pending, (state: CurrentMonthState) => {
      state.status = 'loading';
      // Never show old tasks
      state.tasks = [];
    }).addCase(fetchTasksAsync.fulfilled, (state: CurrentMonthState, action: PayloadAction<MonthTaskList>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    }).addCase(fetchTasksAsync.rejected, (state: CurrentMonthState) => {
      state.status = 'failed';
    });;
  }
});

export const {
  nextMonth,
  currentMonth,
  previousMonth,
  addDailyToTasks,
  removeDailyFromTasks
} = monthSlice.actions;

// Only select the actual month from the state
export const selectMonth = (state: RootState) => state.currentMonth.month;
// Select the whole currentMonth state
export const selectMonthlyTask = (state: RootState) => state.currentMonth;

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

/**
 * Add daily task to the monthly tasks if the task exists in the current month.
 */
export const addDailyTaskToTasks = (task: IDailyTask): AppThunk => (dispatch, getState) => {
  const cMonth = selectMonth(getState());
  if (task.date.month == cMonth.month && task.date.year == cMonth.year)
    dispatch(addDailyToTasks(task));
}


export default monthSlice.reducer;
