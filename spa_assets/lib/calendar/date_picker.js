import "calendar/_styles/date_picker.scss";
import React, {useState} from "react";
import { isSameMonth, isWeekend, isSameDay, isFuture, subMonths } from "date-fns";
import { t } from "i18n";
import useCalendarSheet from "calendar/use_calendar_sheet";

export default function DatePicker({pickedDate, futureOnly}) {
  let {date: selectedDate} = pickedDate;
  let [sheet, sheetActions] = useCalendarSheet(selectedDate.getFullYear(), selectedDate.getMonth(), {
    weekStartsOn: 1, 
    fillAdjacentMonths: true, 
    minWeeksPerSheet: 6
  });
  
  let canSeePreviousSheet = futureOnly ? isFuture(subMonths(sheet.lastDay, 1)) : true;
  let prevMonthProps = {className: "prev-month", testid: "prev-month", onClick: () => sheetActions.subMonths(1)};
  if (!canSeePreviousSheet) {
    prevMonthProps.className = prevMonthProps.className + " is-disabled";
    prevMonthProps.onClick = undefined;
  }

  // Implementation of the function of swiping the months of the calendar to the right to the left by touching your fingers.
  let initialPoint
  let finalPoint

  function onTouchStart (event) {
    initialPoint = event.changedTouches[0].clientX
  }
  function onTouchEnd (event) {
    finalPoint = event.changedTouches[0].clientX
    let xAbs = Math.abs(initialPoint - finalPoint);
    if (xAbs > 120) {
      if (initialPoint > finalPoint) {
        sheetActions.addMonths(1)
      } else if (initialPoint < finalPoint && canSeePreviousSheet) {
        sheetActions.subMonths(1)
      }
    }
  }

  return (
    <div className="datepicker" testid="datepicker">
      <div className="datepicker-header">
        <div {...prevMonthProps}>
          <i className="fas fa-chevron-left"/>
        </div>
        <div className="month-year">
          <span className="month">
            {t(`date_picker.month_names.${sheet.firstDay.getMonth()}`)}
          </span>
          {' '}
          <span className="year">
            {sheet.firstDay.getFullYear()}
          </span>
        </div>
        <div className="next-month" testid="next-month" onClick={() => sheetActions.addMonths(1)}>
          <i className="fas fa-chevron-right"/>
        </div>
      </div>
      <div className="datepicker-sheet" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <WeekDayNames/>
        <SheetBody pickedDate={pickedDate} sheet={sheet} futureOnly={futureOnly}/>
      </div>
    </div>
  );
}

function WeekDayNames() {
  let days = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="week-day-names">
      {days.map(day => 
        <div key={day} className="week-day-name">
          {t(`date_picker.day_names_short.${day}`)}
        </div>
      )}
    </div>
  );
}

function SheetBody({pickedDate, sheet, futureOnly}) {
  return (
    <div className="sheet-body">
      {sheet.weeks.map((week, i) => 
        <div key={i} className="week">
          {week.map((day, i) => 
            <Day key={i} day={day} futureOnly={futureOnly} pickedDate={pickedDate} sheet={sheet}/>
          )}
        </div>
      )}
    </div>
  );
}

function Day({day, sheet, pickedDate, futureOnly}) {
  let {date, actions} = pickedDate;

  let monthClass = "is-inactive";
  let onClick = undefined;
  let isActive = !futureOnly || isFuture(day);
  if (isActive && isSameMonth(day, sheet.firstDay)) {
    monthClass = "";
    onClick = () => actions.setDateFrom(day);
  }
  let weekendClass = isWeekend(day) ? "is-weekend" : "";
  let selectionClass = isSameDay(date, day) ? "is-selected" : "";
  let className = `day ${monthClass} ${weekendClass} ${selectionClass}`;

  return (
    <div className={className} testid={dayTestId(day)} onClick={onClick}>
      {day.getDate()}
    </div>
  );
}

function dayTestId(day) {
  return `day-${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
}