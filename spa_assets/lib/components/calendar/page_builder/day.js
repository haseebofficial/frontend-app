import { mergeDate, days } from "utils/date";

export default class Day {
  constructor(year, month, day) {
    this.date = new Date(year, month, day);

    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    this.isWeekend = isWeekend(this.date);
  }

  makeSelectable({date, callback}) {
    let newDate = mergeDate(date, {
      year: this.year,
      month: this.month,
      day: this.day
    });

    this.select = () => {
      callback(newDate);
    };
  }

  isSameDay(date) {
    return isYearEqual(date, this.date) && 
           isMonthEqual(date, this.date) && 
           isDayEqual(date, this.date);
  }

  isSameMonth(date) {
    return isYearEqual(date, this.date) && isMonthEqual(date, this.date);
  }

  isLessThan(date) {
    let diff = date.getTime() - this.date.getTime();

    let day = 24 * 60 * 60 * 1000;

    return diff > day;
  }
}

function isWeekend(date) {
  return date.getDay() === days.SUNDAY || date.getDay() === days.SATURDAY;
}

function isYearEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}

function isMonthEqual(date1, date2) {
  return date1.getMonth() === date2.getMonth();
}

function isDayEqual(date1, date2) {
  return date1.getDate() === date2.getDate();
}