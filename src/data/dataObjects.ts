/**
 * dataObjects.ts contains object representation of database objects
 */
import { DateNum, MonthNum, WeekNum, YearNum, timeDateFmt, jsWeekDayToWeekNum } from '@/util/datetime'

abstract class Serializable<I> {
  public abstract serialize(): I;
  // TypeScript doesn't allow static abstracts but every child class
  // should implement deSerialize like this
  // public static abstarct deSerialize(obj: I): O;
}

export interface IDateInfo {
  // The day of the month (1–31)
  date: DateNum;
  // The day of the week (1–7, monday-sunday)
  weekday: WeekNum;
  // The month (1–12)
  month: MonthNum;
  // The year (4 digits for 4-digit years)
  year: YearNum;
}

export class DateInfo implements IDateInfo, Serializable<IDateInfo> {
  // The day of the month (1–31)
  public date: DateNum;
  // The day of the week (1–7, monday-sunday)
  public weekday: WeekNum;
  // The month (1–12)
  public month: MonthNum;
  // The year (4 digits for 4-digit years)
  public year: YearNum;

  constructor(date: DateNum, weekday: WeekNum, month: MonthNum, year: YearNum) {
    this.date = date;
    this.weekday = weekday;
    this.month = month;
    this.year = year;
  }

  public serialize(): IDateInfo {
    return { ...this } as IDateInfo;
  }

  public static deSerialize(iDate: IDateInfo): DateInfo {
    return new DateInfo(iDate.date, iDate.weekday, iDate.month, iDate.year);
  }

  public static toString(date: IDateInfo): string {
    const d = timeDateFmt(date.date);
    const m = timeDateFmt(date.month);

    return `${d}.${m}.${date.year}`
  }

  private static fromDate(date: Date): DateInfo {
    const d = date.getDate() as DateNum;
    const weekday = jsWeekDayToWeekNum(date.getDay());
    // getMonth returns (0-11) and we want (1-12)
    const month = date.getMonth() + 1 as MonthNum;
    const year = date.getFullYear() as YearNum;

    return new DateInfo(d, weekday, month, year);
  }

  /**
   * Get the current local date
   */
  public static today(): DateInfo {
    const date = new Date();
    return DateInfo.fromDate(date);
  }

  /**
   * Next date relative to a date
   */
  public static toNextDay(date: IDateInfo): DateInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextDay = new Date(date.year, date.month - 1, date.date);
    nextDay.setDate(nextDay.getDate() + 1);
    return DateInfo.fromDate(nextDay);
  }

  /**
   * Previous date relative to a date
   */
  public static toPreviousDay(date: IDateInfo): DateInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextDay = new Date(date.year, date.month - 1, date.date);
    nextDay.setDate(nextDay.getDate() - 1);
    return DateInfo.fromDate(nextDay);
  }
}

export interface IMonthInfo {
  // Which day of the week is the first day of the month
  // (1–7, monday-sunday)
  startWeekday: WeekNum;
  // Which day of the week is the last day of the month
  endWeekday: WeekNum;
  // Which is the last date (28-31) is the last of the month
  endDate: MonthNum;
  // The month (1–12)
  month: MonthNum;
  // The year (4 digits for 4-digit years)
  year: YearNum;
}

export class MonthInfo implements IMonthInfo, Serializable<IMonthInfo> {
  // Which day of the week is the first day of the month
  // (1–7, monday-sunday)
  public startWeekday: WeekNum;
  // Which day of the week is the last day of the month
  public endWeekday: WeekNum;
  // Which is the last date (28-31) is the last of the month
  public endDate: MonthNum;
  // First day is always 1
  public static readonly firstDay: WeekNum = 1;
  // The month (1–12)
  public month: MonthNum;
  // The year (4 digits for 4-digit years)
  public year: YearNum;


  constructor(
    year: YearNum,
    month: MonthNum,
    endDate: MonthNum,
    endWeekday: WeekNum,
    startWeekday: WeekNum,
  ) {
    this.year = year;
    this.month = month;
    this.endDate = endDate;
    this.endWeekday = endWeekday;
    this.startWeekday = startWeekday;
  }

  /**
  * List of numbers between 1 and endDate. Inclusive
  */
  public dateList(): Array<number> {
    return Array.from({ length: this.endDate }, (_v, k) => k + 1);
  }

  public isSunday(date: number): boolean {
    if (this.startWeekday === 1)
      return date % 7 === 0;

    return date % 7 === 8 - this.startWeekday;
  }

  public isInFirstWeek(date: number): boolean {
    const daysInFirstWeek = 8 - this.startWeekday;
    return date <= daysInFirstWeek;
  }

  public isToday(date: number, cDate: IDateInfo): boolean {
    return date === cDate.date
      && this.year === cDate.year
      && this.month === cDate.month;
  }

  public serialize(): IMonthInfo {
    return { ...this } as IMonthInfo;
  }

  public static deSerialize(iMonth: IMonthInfo): MonthInfo {
    return new MonthInfo(
      iMonth.year,
      iMonth.month,
      iMonth.endDate,
      iMonth.endWeekday,
      iMonth.startWeekday
    );
  }

  private static fromDate(date: Date): MonthInfo {
    const m = date.getMonth();
    const y = date.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const startWeekday = jsWeekDayToWeekNum(firstDay.getDay());
    const endWeekday = jsWeekDayToWeekNum(lastDay.getDay());
    const endDate = lastDay.getDate() as MonthNum;
    const year = y as YearNum;
    // getMonth returns (0-11) and we want (1-12)
    const month = m + 1 as MonthNum;

    return new MonthInfo(year, month, endDate, endWeekday, startWeekday);
  }

  /**
   * Get the current local date
   */
  public static thisMonth(): MonthInfo {
    const date = new Date();
    return MonthInfo.fromDate(date);
  }

  /**
   * Next month relative to a month
   */
  public static toNextMonth(month: IMonthInfo): MonthInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextMonth = new Date(month.year, month.month - 1, 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return MonthInfo.fromDate(nextMonth);
  }

  /**
   * Previous month relative to a month
   */
  public static toPreviousMonth(date: IMonthInfo): MonthInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextMonth = new Date(date.year, date.month - 1, 1);
    nextMonth.setMonth(nextMonth.getMonth() - 1);
    return MonthInfo.fromDate(nextMonth);
  }
}
