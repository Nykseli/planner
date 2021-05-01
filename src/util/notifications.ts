import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import { DailyTask, IDailyTask, DateInfo } from "@/data/dataObjects";

class NotificationTask extends DailyTask {
  private alerted: boolean;

  constructor(task: IDailyTask) {
    super(
      task.title,
      task.description,
      task.date,
      task.startHour,
      task.startMinute,
      task.endHour,
      task.endMinute
    );
    this.alerted = false;
  }

  isNotified(): boolean {
    return this.alerted;
  }

  setNotified(): void {
    this.alerted = true;
  }
}


let alertList: NotificationTask[] = [];

/**
 * Set alert list. List should contain only todays tasks.
 */
export const setNotifications = (alerts: IDailyTask[]) => {
  const today = DateInfo.today();

  if (DateInfo.equal(today, alerts[0].date))
    return;

  const newList: NotificationTask[] = [];
  for (const alert of alerts) {
    newList.push(new NotificationTask(alert));
  }

  alertList = newList;
}

/**
 * Add a new alert item. If it exists, update it instead.
 */
export const addOrUpdateNotification = (task: IDailyTask) => {

  for (let i = 0; i < alertList.length; i++) {
    if (alertList[i].id === task.id) {
      alertList[i] == new NotificationTask(task);
    }
  }

  alertList.push(new NotificationTask(task));
}


/**
 * Remove existing alert
 */
export const removeNotification = (task: IDailyTask) => {
  for (let i = 0; i < alertList.length; i++) {
    if (alertList[i].id === task.id) {
      alertList.splice(i, 1);
    }
  }
}


const checkNotifications = () => {
  const now = new Date();
  const nowInfo = DateInfo.fromDate(now);
  for (const alert of alertList) {
    if (now.getHours() === alert.startHour
      && now.getMinutes() === alert.startMinute
      && DateInfo.equal(alert.date, nowInfo)) {

      if (!alert.isNotified()) {
        sendInstantNotificaion(alert);
        alert.setNotified();
      }
    }
  }
}

/** Making sure that backgroundtasks are not registered mulitple times */
let backgroundTaskInit = false;
/** Making sure that foregroundtasks are not registered mulitple times */
let foregroundTaskInit = false;

/**
 * Unreliable background task but it's the best we have
 */
export const initNotificationBackgroundTask = async () => {
  if (backgroundTaskInit)
    return;

  backgroundTaskInit = true;

  const TASK_NAME = "BACKGROUND_ALERT_TASK"

  TaskManager.defineTask(TASK_NAME, () => {

    try {
      checkNotifications();
      return BackgroundFetch.Result.NoData
    } catch (err) {
      return BackgroundFetch.Result.Failed
    }
  });

  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 5, // seconds,
    })
  } catch (err) {
  }
}

export const initNotificationForegroundTask = async () => {
  if (foregroundTaskInit)
    return;

  foregroundTaskInit = true;

  setInterval(() => {
    checkNotifications();
  }, 5000);
}



const askNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  return true;
}

/**
 * Notification user instantly. Ignored if we don't have a permissions to send notifs.
 */
const sendInstantNotificaion = async (alertTask: NotificationTask) => {
  // No need to even try to send a notification if we
  // know that we don't have a permission
  const hasPermission = await askNotificationPermission();
  if (!hasPermission)
    return;

  // First, set the handler that will cause the notification
  // to show the alert
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });

  // Second, call the method
  // Not that things like "Do not disturb" mode will ignore the notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: alertTask.title,
      body: alertTask.description,
    },
    trigger: null,
  });
}
