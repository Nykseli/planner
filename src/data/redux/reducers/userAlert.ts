/**
 * Reducer used to control components/UserAlert module.
 * Showing erros and other info to user.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Number is time in milliseconds, short 2 seconds, long 5 seconds.
export type DisplayTime = number | 'short' | 'long';

interface UserAlertState {
  display: 'show' | 'hidden';
  color: 'info' | 'warn' | 'error';
  message: string;
  displayTime: DisplayTime;
}

export interface IUserAlert {
  color: 'info' | 'warn' | 'error';
  message: string;
  displayTime: DisplayTime;
}

const initialState: UserAlertState = {
  display: 'hidden',
  color: 'info',
  message: 'Hello!',
  displayTime: 'long'
};

const userAlertSlice = createSlice({
  name: 'userAlert',
  initialState,
  reducers: {
    showUserAlert: (state, action: PayloadAction<IUserAlert>) => {
      state.color = action.payload.color;
      state.message = action.payload.message;
      state.displayTime = action.payload.displayTime;
      state.display = 'show';
    },
    hideUserAlert: (state) => {
      state.display = 'hidden';
    }
  }
});

export const { showUserAlert,hideUserAlert } = userAlertSlice.actions;

export const selectAlertState = (state: RootState) => state.userAlert;

export default userAlertSlice.reducer;
