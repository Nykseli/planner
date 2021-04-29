
// Number representation of dates in month
export type DateNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
// Number representation of months
export type MonthNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
// Number representation of week days (monday - sunday)
export type WeekNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
// Year number for consistency
export type YearNum = number;


/**
 * Return 0 padded string if number < 10
 *
 * eg  8 => "08"
 *    10 => "10"
 */
export const timeDateFmt = (td: number): string => {
  return `${td < 10 ? '0' + td : td}`;
}

export const timeDiffString = (date1: Date, date2: Date): string => {
  const diffSeconds = Math.floor((date2.getTime() - date1.getTime()) / 1000);
  const days = Math.floor(diffSeconds / 60 / 60 / 24);
  const hours = Math.floor(diffSeconds / 60 / 60) % 24;
  const minutes = Math.floor(diffSeconds / 60) % 60;
  let diffString = "";

  if (days > 0)
    diffString = `${diffString} ${days} days`;

  if (hours > 0)
    diffString = `${diffString} ${hours} hours`;

  if (minutes > 0)
    diffString = `${diffString} ${minutes} minutes`;

  if (diffString === "")
    return " < minute";

  return diffString;
}

/**
 * In js Date object, week days are from 0 to 6
 * and WeekNum is 1 to 7
 */
export const jsWeekDayToWeekNum = (day: number): WeekNum => {
  let weekday = day;
  if (weekday == 0)
    weekday = 7;

  return weekday as WeekNum;
}
