import {
  format,
  parseISO,
  addDays as adddays,
  differenceInDays,
  formatDistanceToNow as fdtn,
} from 'date-fns';

export const formatString = (date, strformat = 'dd MMM yyyy HH:mm:ss') => {
  if (typeof date === 'string') {
    let parsed = parseISO(date);

    return format(parsed, strformat);
  } else if (date instanceof Date) {
    return format(date, strformat);
  }
};

export const addDays = (date, amount) => {
  if (typeof date === 'string') {
    let parsed = parseISO(date);

    return adddays(parsed, amount);
  } else if (date instanceof Date) {
    return adddays(date, amount);
  }
};

export const toDate = (obj) => {
  if (typeof obj === 'string') {
    let parsed = parseISO(obj);

    return parsed;
  } else if (obj instanceof Date) {
    return obj;
  } else {
    return null;
  }
};

export const datediff = (date1, date2) => {
  let obj1, obj2;
  obj1 = toDate(date1);
  obj2 = toDate(date2);

  return differenceInDays(obj1, obj2);
};

export const formatDistanceToNow = (
  date1,
  formatDate = 'dd MMM yyyy',
  minShowDate = 30,
) => {
  let diff = Math.abs(differenceInDays(toDate(date1), new Date()));

  if (diff > minShowDate) {
    let obj1 = format(toDate(date1), formatDate);
    return obj1;
  } else {
    let obj1 = toDate(date1);
    return fdtn(obj1, { addSuffix: false, includeSeconds: true }).replace(
      /waktu/,
      '',
    );
  }
};
