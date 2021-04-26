import { IMonthInfo, IMonthViewTask } from './dataObjects'
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
