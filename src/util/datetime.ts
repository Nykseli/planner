import { MonthInfo } from "@/data/dataObjects";

// Number representation of dates in month
export type DateNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
// Number representation of months
export type MonthNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
// Number representation of week days (monday - sunday)
export type WeekNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
// Year number for consistency
export type YearNum = number;

class CurrentMonthInfo extends MonthInfo {

  constructor() {
    const date = new Date();
    const m = date.getMonth();
    const y = date.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const startWeekday = firstDay.getDay() as WeekNum;
    const endWeekday = lastDay.getDay() as WeekNum;
    const endDate = lastDay.getDate() as MonthNum;
    const year = y as YearNum;
    // getMonth returns (0-11) and we want (1-12)
    const month = m + 1 as MonthNum;

    super(year, month, endDate, endWeekday, startWeekday);
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

  public isToday(date: number, cDate: any): boolean {
    return date === cDate.date
      && this.year === cDate.year
      && this.month === cDate.month;
  }

}

/**
 * Return 0 padded string if number < 10
 *
 * eg  8 => "08"
 *    10 => "10"
 */
const timeDateFmt = (td: number): string => {
  return `${td < 10 ? '0' + td : td}`;
}

export {

  CurrentMonthInfo,

  timeDateFmt
}
