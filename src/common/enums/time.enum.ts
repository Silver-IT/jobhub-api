export enum TimeUnit {
  Year = 'YEAR',
  Month = 'MONTH',
  Week = 'WEEK',
  Day = 'DAY',
  Hour = 'HOUR',
}

export const DEFAULT_FROM_DATE = new Date('1900-01-01').toISOString();
export const DEFAULT_TO_DATE = new Date('2999-01-01').toISOString();
