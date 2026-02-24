import { format, parse, parseJSON } from 'date-fns';
import {
  zonedTimeToUtc,
  toDate,
  utcToZonedTime,
  formatInTimeZone,
} from 'date-fns-tz';

import { envConfig } from '../config/envConfig';


const DATE_FORMAT_DEFAULT = 'yyyy-MM-dd';
const DATE_TIME_FORMAT_DEFAULT = 'yyyy-MM-dd HH:mm:ss';
// export const TIMEZONE_BACKEND: string = envConfig.TIMEZONE_BACKEND as string;
// export const TIMEZONE_FRONTEND: string = envConfig.TIMEZONE_FRONTEND as string;
const TIMEZONE_DEFAULT: string = envConfig.TIMEZONE as string;

/**
 * The date-fns `formatInTimeZone` formats the UTC date to UTC date+TimeZone-offset (e.g. UTC+08:00 or UTC GMT+8).
 * This is not the expected return.
 * We need to use `utcToZonedTime` to convert the UTC date to target TimeZone date first.
 * And then use `format` to format the date
 * @param date
 * @param pattern
 * @returns
 */
const _formatDatetime = (
  date?: Date,
  pattern: string = DATE_TIME_FORMAT_DEFAULT
) => {
  // return date == null ? date : format(date, pattern);
  const timezone: string = TIMEZONE_DEFAULT;
  // const formattedDatetime = date == null ? date : formatInTimeZone(date, timezone, pattern);
  const zonedDatetime = date == null ? date : utcToZonedTime(date, timezone);
  const formattedDatetime =
    zonedDatetime == null ? zonedDatetime : format(zonedDatetime, pattern);
  // console.debug('date - _formatDatetime - timezone: ', timezone);
  // console.debug('date - _formatDatetime - date: ', date);
  // console.debug('date - _formatDatetime - zonedDatetime: ', zonedDatetime);
  // console.debug(
  //   'date - _formatDatetime - formattedDatetime: ',
  //   formattedDatetime
  // );
  return formattedDatetime;
};
const formatDate = (date?: Date, pattern: string = DATE_FORMAT_DEFAULT) => {
  return _formatDatetime(date, pattern);
};
const formatDatetime = (
  date?: Date,
  pattern: string = DATE_TIME_FORMAT_DEFAULT
) => {
  return _formatDatetime(date, pattern);
};
const parseUtcToDate = (obj: Date | string | number) => {
  // const zonedDatetime = toDate(obj);
  const timezone: string = TIMEZONE_DEFAULT;
  // const zonedDatetime = utcToZonedTime(obj, timezone);
  const objStrZ =
    obj.toString().lastIndexOf('.') < 0
      ? ''
      : obj
          .toString()
          .substring(obj.toString().lastIndexOf('.'), obj.toString().length);
  const objStrDt =
    obj.toString().lastIndexOf('.') < 0
      ? obj.toString()
      : obj.toString().substring(0, obj.toString().lastIndexOf('.'));
  const objStr = objStrDt + objStrZ + 'Z';
  const zonedDatetime = new Date(objStr);
  // console.debug('date - parseUtcToDate - obj: ', obj);
  // console.debug('date - parseUtcToDate - objStr: ', objStr);
  // console.debug('date - parseUtcToDate - objStrDt: ', objStrDt);
  // console.debug('date - parseUtcToDate - objStrZ: ', objStrZ);
  // console.debug('date - parseUtcToDate - zonedDatetime: ', zonedDatetime);
  // console.debug('date - parseUtcToDate - timezone: ', timezone);
  return zonedDatetime;
};
const parseDateToUtc = (obj: Date | string | number) => {
  const timezone: string = TIMEZONE_DEFAULT;
  const zonedDatetime = zonedTimeToUtc(obj, timezone);
  // console.debug('date - parseDateToUtc - zonedDatetime: ', zonedDatetime);
  // console.debug('date - parseDateToUtc - zonedDatetime.getTimezoneOffset: [' + Math.abs(zonedDatetime.getTimezoneOffset()) + ']');
  return zonedDatetime;
  // return parseJSON(obj);
  // return toDate(obj);
};

export {
  DATE_FORMAT_DEFAULT,
  DATE_TIME_FORMAT_DEFAULT,
  TIMEZONE_DEFAULT,
  formatDate,
  formatDatetime,
  parseDateToUtc,
  parseUtcToDate,
};
