import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { DateInfo, IDailyTask, IDateInfo } from '@/data/dataObjects';
import { fetchDailyTasks, postNewDailyTask, updateExistingDailyTask } from '@/data/api';
import { fromDateInfo, selectDate } from './currentDate'
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
      console.log("before error?");
      state.tasks.push(action.payload);
    },
    updateDailyTask: (state, action: PayloadAction<IDailyTask>) => {
      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id === action.payload.id) {
          state.tasks[i] = action.payload
          break;
        }
      }
    },
    removeDailyTask: (state, action: PayloadAction<IDailyTask>) => {
      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id === action.payload.id) {
          state.tasks.splice(i, 1);
          break;
        }
      }
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

const { addDailyTask, updateDailyTask, removeDailyTask } = dailyTasksSlice.actions;

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

/**
 * Save new task to via the api.
 * Task is updated to dailyTasks and montlyTasks if the api call is succesful.
 */
// TODO: dispatch and getstate types.
export const editExistingDailyTask = (task: IDailyTask): AppThunk => (dispatch, getState) => {
  // TODO: set errors on fail
  updateExistingDailyTask(task).then((data) => {
    const nTask = data.data;
    const cDate = selectDate(getState());
    // TODO: also update and remove the task from monthly tasks
    if (DateInfo.equal(cDate, nTask.date)) {
      dispatch(updateDailyTask(nTask));
    } else {
      dispatch(removeDailyTask(task));
      // If the date of the task has changed. We want to change the date
      // to match the newly selected date.
      dispatch(fromDateInfo(nTask.date));
    }

    // TODO: let user know this was a success
  }).catch((reason) => {
    // TODO: display an error
    console.warn(reason);
  });
}

export default dailyTasksSlice.reducer;
