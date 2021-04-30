import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Root: undefined;
  DailyView: undefined;
  NotFound: undefined;
  Settings: undefined;
  LanguageSelection: undefined;
  StyleSelection: undefined;
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

export type SettingsScreenParamList = {
  Settings: undefined;
}

export type LanguageSelectionParamList = {
  LanguageSelection: undefined;
}

export type StyleSelectionParamList = {
  StyleSelection: undefined;
}

export type PropChildren = React.ReactChild | React.ReactChild[] | React.ReactChildren;

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
