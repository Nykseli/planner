import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { IDailyTask, IMonthViewTask, IMonthInfo } from '@/data/dataObjects';
import { fetchMontlyTasks } from '@/data/api'
import { selectMonth } from './currentMonth';

export interface TaskMap {
  // Number should be DateNum
  [tasks: number]: IMonthViewTask;
}

export interface MonthlyTasksState {
  tasks: TaskMap;
  status: 'unitinitalized' | 'idle' | 'loading' | 'failed';
}

const initialState: MonthlyTasksState = {
  tasks: {},
  status: 'unitinitalized',
};

export const fetchTasksAsync = createAsyncThunk(
  'monthlyTasks/fetchTasks',
  async (month: IMonthInfo) => {
    const response = await fetchMontlyTasks(month);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const tasksSlice = createSlice({
  name: 'monthlyTasks',
  initialState,
  reducers: {
    addDailyToTasks: (state, action: PayloadAction<IDailyTask>) => {
      const tDate = action.payload.date.date;
      const tasks = state.tasks[tDate] ?? { taskCount: 0 };
      tasks.taskCount += 1;
      state.tasks[tDate] = tasks;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder.addCase(fetchTasksAsync.pending, (state: MonthlyTasksState) => {
      state.status = 'loading';
    }).addCase(fetchTasksAsync.fulfilled, (state: MonthlyTasksState, action: PayloadAction<TaskMap>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    });
  }
});

const { addDailyToTasks } = tasksSlice.actions;

export const selectMonthlyTask = (state: RootState) => state.monthlyTasks;

/**
 * Add daily task to the monthly tasks if the task exists in the current month.
 */
export const addDailyTaskToTasks = (task: IDailyTask): AppThunk => (dispatch, getState) => {
  const cMonth = selectMonth(getState());
  if (task.date.month == cMonth.month && task.date.year == cMonth.year)
    dispatch(addDailyToTasks(task));
}

export default tasksSlice.reducer;
