import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Root: undefined;
  DailyView: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  MonthlyView: undefined;
  DailyView: undefined;
};

export type MonthlyViewParamList = {
  MonthlyViewScreen: undefined;
};

export type DailyViewParamList = {
  DailyViewScreen: undefined;
};

// Special navigation type from https://reactnavigation.org/docs/typescript/
export type MonthlyViewNavigation = StackScreenProps<RootStackParamList, 'DailyView'>;
export type MVNavigation = MonthlyViewNavigation['navigation']

// Custom call backs for handling information for reducer dispatches
export type ReducerFail = (message?: string) => void;
export type ReducerSuccess = (data?: any) => void;
export type ReducerCallBacks = {
  onFail?: ReducerFail;
  onSuccess?: ReducerSuccess;
}
