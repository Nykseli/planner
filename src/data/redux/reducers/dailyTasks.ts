import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { RootState } from '@/data/redux/store';

import { IDailyTask, IDateInfo } from '@/data/dataObjects';
import { fetchDailyTasks } from '@/data/api'

export interface DailyTasksState {
  tasks: IDailyTask[];
  status: 'unitinitalized' | 'idle' | 'loading' | 'failed';
}

const initialState: DailyTasksState = {
  tasks: [],
  status: 'unitinitalized',
};

export const fetchDailyTasksAsync = createAsyncThunk(
  'dailyTasks/fetchTasks',
  async (date: IDateInfo) => {
    const response = await fetchDailyTasks(date);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const dailyTasksSlice = createSlice({
  name: 'dailyTasks',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder.addCase(fetchDailyTasksAsync.pending, (state: DailyTasksState) => {
      state.status = 'loading';
    }).addCase(fetchDailyTasksAsync.fulfilled, (state: DailyTasksState, action: PayloadAction<IDailyTask[]>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    });
  }
});

export const selectDailyTask = (state: RootState) => state.dailyTasks;

export default dailyTasksSlice.reducer;
