
class CurrentDateInfo {
  // The day of the month (1–31)
  public date: number;
  // The day of the week (1–7, monday-sunday)
  public weekday: number;
  // The month (1–12)
  public month: number;
  // The year (4 digits for 4-digit years)
  public year: number;

  constructor() {
    const date = new Date();
    // Transform sunday (0) to 7
    let _weekday = date.getDay();
    if (_weekday == 0)
      _weekday = 7;

    this.date = date.getDate();
    this.weekday = _weekday;
    // getMonth returns (0-11) and we want (1-12)
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }

  public currentDateString(): string {
    const d = timeDateFmt(this.date);
    const m = timeDateFmt(this.month);

    return `${d}.${m}.${this.year}`
  }
}

class CurrentMonthInfo {
  // Which day of the week is the first day of the month
  // (1–7, monday-sunday)
  public startWeekday: number;
  // Which day of the week is the last day of the month
  public endWeekday: number;
  // Which is the last date (28-31) is the last of the month
  public endDate: number;
  // First day is always 1
  public static readonly firstDay: number = 1;
  // The month (1–12)
  public month: number;
  // The year (4 digits for 4-digit years)
  public year: number;


  constructor() {
    const date = new Date();
    const m = date.getMonth();
    const y = date.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    this.startWeekday = firstDay.getDay();
    this.endWeekday = lastDay.getDay();
    this.endDate = lastDay.getDate();
    this.year = y;
    // getMonth returns (0-11) and we want (1-12)
    this.month = m + 1;
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

  public isToday(date: number, cDate: CurrentDateInfo): boolean {
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
  CurrentDateInfo,
  CurrentMonthInfo,

  timeDateFmt
}
