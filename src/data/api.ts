import { IDailyTask, IDateInfo, IMonthInfo, DateInfo, DailyTask } from './dataObjects'
import { TaskMap } from './redux/reducers/montlyTasks'

const tmptoday = DateInfo.today();

interface TMPTaskMap { [month: number]: TaskMap; }
const tempMonthlyTaskData: TMPTaskMap = {};
tempMonthlyTaskData[tmptoday.month] = { 1: { taskCount: 5 }, 4: { taskCount: 3 }, 5: { taskCount: 4 }, 12: { taskCount: 15 }, 16: { taskCount: 20 }, 17: { taskCount: 6 }, 18: { taskCount: 1 }, 20: { taskCount: 12 }, 25: { taskCount: 88 }, };
tempMonthlyTaskData[tmptoday.month + 1] = { 3: { taskCount: 5 }, 1: { taskCount: 3 }, 5: { taskCount: 4 }, 12: { taskCount: 12 }, 14: { taskCount: 6 }, 15: { taskCount: 3 }, 16: { taskCount: 4 }, 17: { taskCount: 20 }, 18: { taskCount: 15 }, 20: { taskCount: 12 }, 28: { taskCount: 15 }, };

// A mock function to mimic making an async request for task data
export function fetchMontlyTasks(month: IMonthInfo) {
  return new Promise<{ data: TaskMap }>(
    (resolve) =>
      setTimeout(() => resolve(
        { data: tempMonthlyTaskData[month.month] || {} },
      ), 250)
  );
}

interface TMPDailyTasks { [date: number]: IDailyTask[] }
interface TMPMonthTasks { [month: number]: TMPDailyTasks }
let tmpDailyTaskList: TMPMonthTasks = { [tmptoday.month]: {} };
tmpDailyTaskList[tmptoday.month][tmptoday.date] = [{ id: DailyTask.genId(), title: "Test title for this test day", description: "Short lorem ipsum lopsum for now", date: DateInfo.today().serialize(), startHour: 1, startMinute: 10, endHour: 2, endMinute: 30, }, { id: DailyTask.genId(), title: "Second thing is happening", description: "Well this is interesting I hope this is a good thing!", date: DateInfo.today().serialize(), startHour: 4, startMinute: 20, endHour: 5, endMinute: 30, }];

// A mock function to mimic making an async request for task data
export function fetchDailyTasks(date: IDateInfo) {
  return new Promise<{ data: IDailyTask[] }>(
    (resolve) =>
      setTimeout(() => resolve(
        { data: tmpDailyTaskList[date.month][date.date] || [] },
      ), 250)
  );
}

export function postNewDailyTask(task: IDailyTask) {
  return new Promise<{ data: IDailyTask }>(
    (resolve) => {
      setTimeout(() => resolve(
        { data: task },
      ), 250)
    }
  );
}

export function updateExistingDailyTask(task: IDailyTask) {
  return new Promise<{ data: IDailyTask }>(
    (resolve) => {
      setTimeout(() => resolve(
        { data: task },
      ), 250)
    }
  );
}
