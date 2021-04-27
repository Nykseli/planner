import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { DateInfo, IDailyTask, IDateInfo } from '@/data/dataObjects';
import { fetchDailyTasks, postNewDailyTask } from '@/data/api';
import { selectDate } from './currentDate'
import { addDailyTaskToTasks } from './montlyTasks'

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
  reducers: {
    addDailyTask: (state, action: PayloadAction<IDailyTask>) => {
      state.tasks.push(action.payload);
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<DailyTasksState>) => {
    builder.addCase(fetchDailyTasksAsync.pending, (state: DailyTasksState) => {
      state.status = 'loading';
    }).addCase(fetchDailyTasksAsync.fulfilled, (state: DailyTasksState, action: PayloadAction<IDailyTask[]>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    });
  }
});

const { addDailyTask } = dailyTasksSlice.actions;

export const selectDailyTask = (state: RootState) => state.dailyTasks;

/**
 * Save new task to via the api.
 * Task is updated to dailyTasks and montlyTasks if the api call is succesful.
 */
// TODO: dispatch and getstate types.
export const addNewDailyTask = (task: IDailyTask): AppThunk => (dispatch, getState) => {
  // TODO: set errors on fail
  postNewDailyTask(task).then((data) => {
    const nTask = data.data;
    const cDate = selectDate(getState());
    if (DateInfo.equal(cDate, nTask.date)) {
      dispatch(addDailyTask(nTask));
    }

    dispatch(addDailyTaskToTasks(nTask));
  }).catch((reason) => {
    // TODO: display an error
    console.warn(reason);
  });
}

export default dailyTasksSlice.reducer;
