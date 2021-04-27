import { createAsyncThunk, createSlice, ActionReducerMapBuilder, PayloadAction, } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/data/redux/store';

import { DateInfo, IDailyTask, IDateInfo } from '@/data/dataObjects';
import { fetchDailyTasks, postNewDailyTask, updateExistingDailyTask } from '@/data/api';
import { addDailyTaskToTasks } from './montlyTasks'

export interface CurrentDateState {
  date: IDateInfo;
  tasks: IDailyTask[];
  // Status refers to the loading of the tasks data.
  // date is always generated locally.
  status: 'unitinitalized' | 'idle' | 'loading' | 'failed';
}

// Start with the current day on default
const initialState: CurrentDateState = {
  date: DateInfo.today().serialize(),
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
    },
    fromDateInfo: (state, action: PayloadAction<IDateInfo>) => {
      state.date = action.payload;
    },
    addDailyTask: (state, action: PayloadAction<IDailyTask>) => {
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
  extraReducers: (builder: ActionReducerMapBuilder<CurrentDateState>) => {
    builder.addCase(fetchDailyTasksAsync.pending, (state: CurrentDateState) => {
      state.status = 'loading';
    }).addCase(fetchDailyTasksAsync.fulfilled, (state: CurrentDateState, action: PayloadAction<IDailyTask[]>) => {
      state.status = 'idle';
      state.tasks = action.payload;
    });
  }
});

export const {
  nextDate,
  fromDateInfo,
  previousDate,
  currentDate,
  addDailyTask,
  updateDailyTask,
  removeDailyTask
} = dateSlice.actions;

// Only select the actual date from the state
export const selectDate = (state: RootState) => state.currentDate.date
// Select the whole currenDate state
export const selectCurrentDate = (state: RootState) => state.currentDate;

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

export default dateSlice.reducer;
