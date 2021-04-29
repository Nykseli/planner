import { Platform } from 'react-native';
import { request, gql } from 'graphql-request'

import { IDailyTask, IDateInfo, IMonthInfo, stringifySerialized } from './dataObjects'
import { MonthTaskList } from './redux/reducers/currentMonth'

type TaskMutation = 'addDailyTask' | 'updateDailyTask' | 'deleteDailyTask'

// On android 10.0.2.2 refers to host maschine localhost
const apiUrl = "http://10.0.2.2:4000";
if (Platform.OS !== 'android') {
  throw new Error("Fix API url on non-android platform");
}

const genMontlyTasksRequest = (month: IMonthInfo): string => {
  return gql`
  {
    monthlyTasks(month:${month.month}, year: ${month.year}) {
      taskCount
    }
  }`;
}

const genDailyTasksRequest = (date: IDateInfo): string => {
  return gql`
  {
    dailyTasks(date:${stringifySerialized(date)}) {
      id
      title
      description,
      date {
        date
        month
        year
        weekday
      }
      startHour
      startMinute
      endHour
      endMinute
    }
  }`;
}

const genTaskMutationRequest = (mutation: TaskMutation, task: IDailyTask): string => {
  return gql`
  mutation {
    ${mutation}(task:${stringifySerialized(task)}) {
      id
      title
      description,
      date {
        date
        month
        year
        weekday
      }
      startHour
      startMinute
      endHour
      endMinute
    }
  }`;
}

export const fetchMontlyTasks = (month: IMonthInfo):
  Promise<{ monthlyTasks: MonthTaskList }> => {
  return request(apiUrl, genMontlyTasksRequest(month));
}

export const fetchDailyTasks = (date: IDateInfo):
  Promise<{ dailyTasks: IDailyTask[] }> => {
  return request(apiUrl, genDailyTasksRequest(date));
}

export const postNewDailyTask = (task: IDailyTask):
  Promise<{ addDailyTask: IDailyTask }> => {
  // Make id null so backend knows to generate a right id for it
  // stringifySerialized translates NaNs to null
  task.id = NaN;
  return request(apiUrl, genTaskMutationRequest("addDailyTask", task));
}

export const updateExistingDailyTask = (task: IDailyTask):
  Promise<{ updateDailyTask: IDailyTask }> => {
  return request(apiUrl, genTaskMutationRequest("updateDailyTask", task));
}

export const deleteExistingDailyTask = (task: IDailyTask):
  Promise<{ deleteDailyTask: IDailyTask }> => {
  return request(apiUrl, genTaskMutationRequest('deleteDailyTask', task));
}
