import * as Moment from 'moment';
import { utcToZonedTime } from 'date-fns-tz';
import { TimeUnit } from '../enums/time.enum';


const DefaultTimezone = 'America/Antigua';

export function convertUtcToEstString(date: Date): string {
  const est = utcToZonedTime(date, DefaultTimezone);
  return Moment(est).format('MMMM Do YYYY [at] h:mm A [EST]');
}

export function formatTimeByUnit(unit: TimeUnit) {
  if (unit === TimeUnit.Year) {
    return 'YYYY';
  } else if (unit === TimeUnit.Month) {
    return 'YYYY-MM-01 00:00';
  } else if (unit === TimeUnit.Day) {
    return 'YYYY-MM-DD 00:00';
  } else if (unit === TimeUnit.Hour) {
    return 'YYYY-MM-DD HH:00';
  } else {
    return 'YYYY-MM-DD 00:00';
  }
}
