
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
