import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { RootState } from '@/data/redux/store';

import { IMonthViewTask, IMonthInfo } from '@/data/dataObjects';
import { fetchMontlyTasks } from '@/data/api'

export interface TaskMap {
  // Number should be DateNum
  [tasks: number]: IMonthViewTask;
}

export interface MonthlyTasksState {
  tasks: TaskMap;
  status: 'unitinitalized' | 'idle' | 'loading' | 'failed';
}

// Start with the current month by default
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
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder.addCase(fetchTasksAsync.pending, (state: MonthlyTasksState) => {
      state.status = 'loading';
    }).addCase(fetchTasksAsync.fulfilled, (state: MonthlyTasksState, action: PayloadAction<TaskMap>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    });


  }
});

export const selectMonthlyTask = (state: RootState) => state.monthlyTasks;

export default tasksSlice.reducer;
