export const days = {
  SUNDAY: 0,
  MONDAY: 1,  
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function mergeDate(date, { year, month, day, hours, minutes }) {
  year = or(year, date.getFullYear());
  month = or(month, date.getMonth());
  day = or(day, date.getDate());
  hours = or(hours, date.getHours());
  minutes = or(minutes, date.getMinutes());

  return new Date(year, month, day, hours, minutes);
}

function or(value, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  } else {
    return value;
  }
}