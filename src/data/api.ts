import { IDailyTask, IDateInfo, IMonthInfo, DateInfo } from './dataObjects'
import { TaskMap } from './redux/reducers/montlyTasks'

interface TMPTaskMap { [month: number]: TaskMap; }
const tempMonthlyTaskData: TMPTaskMap = {
  4: { 1: { taskCount: 5 }, 4: { taskCount: 3 }, 5: { taskCount: 4 }, 12: { taskCount: 15 }, 16: { taskCount: 20 }, 17: { taskCount: 6 }, 18: { taskCount: 1 }, 20: { taskCount: 12 }, 25: { taskCount: 88 }, },
  5: { 3: { taskCount: 5 }, 1: { taskCount: 3 }, 5: { taskCount: 4 }, 12: { taskCount: 12 }, 14: { taskCount: 6 }, 15: { taskCount: 3 }, 16: { taskCount: 4 }, 17: { taskCount: 20 }, 18: { taskCount: 15 }, 20: { taskCount: 12 }, 28: { taskCount: 15 }, }
};

// A mock function to mimic making an async request for task data
export function fetchMontlyTasks(month: IMonthInfo) {
  return new Promise<{ data: TaskMap }>(
    (resolve) =>
      setTimeout(() => resolve(
        { data: tempMonthlyTaskData[month.month] || {} },
      ), 250)
  );
}

const tmpDailyTaskList: IDailyTask[] = [{
  title: "Test title for this test day", desciption: "Short lorem ipsum lopsum for now", date: DateInfo.today().serialize(), startHour: 1, startMinute: 10, endHour: 2, endMinute: 30,
}, {
  title: "Second thing is happening", desciption: "Well this is interesting I hope this is a good thing!", date: DateInfo.today().serialize(), startHour: 4, startMinute: 20, endHour: 5, endMinute: 30,
}]
// A mock function to mimic making an async request for task data
export function fetchDailyTasks(date: IDateInfo) {
  return new Promise<{ data: IDailyTask[] }>(
    (resolve) =>
      setTimeout(() => resolve(
        { data: tmpDailyTaskList },
      ), 250)
  );
}
