import { getDaysInMonth, mergeDate, days } from "utils/date";

export function findFirstMonday(date) {
  let monthStart = beginningOfMonth(date);

  if (isMonday(monthStart)) {
    return monthStart;
  } else {
    return lastMondayOfPrevMonth(monthStart);
  }
}

function beginningOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth());
}

function isMonday(date) {
  return date.getDay() === days.MONDAY;
}

function lastMondayOfPrevMonth(monthStart) {
  let day = monthStart.getDay();
  let daysAfterMonday;

  if (day === days.SUNDAY) {
    daysAfterMonday = 6;
  } else {
    daysAfterMonday = day - days.MONDAY;
  }

  let lastMonday = mergeDate(monthStart, { day: 1 - daysAfterMonday });

  return lastMonday;
}

export function findLastSunday(date) {
  let monthEnd = endOfMonth(date);

  if (isSunday(monthEnd)) {
    return monthEnd;
  } else {
    return firstSundayOfNextMonth(monthEnd);
  }
}

function endOfMonth(date) {
  let lastDay = getDaysInMonth(date.getFullYear(), date.getMonth());
  return new Date(date.getFullYear(), date.getMonth(), lastDay);
}

function isSunday(date) {
  return date.getDay() === days.SUNDAY;
}

function firstSundayOfNextMonth(monthEnd) {
  let daysUntilSunday = 7 - monthEnd.getDay();
  let firstSunday = mergeDate(monthEnd, { day: monthEnd.getDate() + daysUntilSunday });

  return firstSunday;
}