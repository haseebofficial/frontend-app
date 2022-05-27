import Day from "./day";
import { mergeDate } from "utils/date";
import { findFirstMonday, findLastSunday } from "components/calendar/page_builder/utils";

export default class PageBuilder {
  constructor(year, month, { onSelect, selectedDate, futureOnly }) {
    let date = new Date(year, month);
    this._displayedDate = date;
    this._startDate = findFirstMonday(date);

    let endDate = findLastSunday(date);
    
    let weeks = countWeeks(this._startDate, endDate);
    if (weeks === 6) {
      this._endDate = endDate;
    } else if (weeks === 4) {
      this._endDate = mergeDate(endDate, { day: endDate.getDate() + 14 });
    } else {
      this._endDate = mergeDate(endDate, { day: endDate.getDate() + 7 });
    }

    if (futureOnly) {
      this._disableBefore = new Date();
    }

    this._onSelect = onSelect;
    this._selectedDate = selectedDate;
  }

  canDisplayPreviousMonth() {
    if (this._disableBefore) {
      return isMonthGreater(this._displayedDate, this._disableBefore);
    } else {
      return true;
    }
  }

  eachRow(callback) {
    let date = this._startDate;
    let index = 0;

    while (date.getTime() < this._endDate.getTime()) {
      let row = this._buildRow(date);

      callback(row, index);

      date = mergeDate(date, { day: date.getDate() + 7 });
      index += 1;
    }
  }

  _buildRow(weekStart) {
    let eachDay = (callback) => {
      for (let dayN = 0; dayN <= 6; dayN++) {
        let day = new Day(
          weekStart.getFullYear(), 
          weekStart.getMonth(), 
          weekStart.getDate() + dayN
        );

        if (!day.isSameMonth(this._displayedDate)) {
          day.isDisabled = true;
        }

        if (day.isSameDay(this._selectedDate)) {
          day.isSelected = true;
        }

        if (this._disableBefore && day.isLessThan(this._disableBefore)) {
          day.isDisabled = true;
        }
        
        if (!day.isDisabled && !day.isSelected) {
          day.makeSelectable({ date: this._selectedDate, callback: this._onSelect });
        }

        callback(day, dayN);
      }
    };

    return { eachDay };
  }
}

function countWeeks(start, end) {
  let oneDay = 24 * 60 * 60 * 1000;
  let timeElapsed = end - start + oneDay;

  let weeks = timeElapsed / (7 * 24 * 60 * 60 * 1000);

  return weeks;
}

function isMonthGreater(date1, date2) {
  if (date1.getFullYear() > date2.getFullYear()) {
    return true;
  } else if (date1.getFullYear() === date2.getFullYear()) {
    return date1.getMonth() > date2.getMonth();
  } else {
    return false;
  }
}