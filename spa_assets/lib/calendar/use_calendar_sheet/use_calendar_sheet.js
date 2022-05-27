import { useState, useMemo } from "react";
import { strictOr } from "utils/bool_utils";
import CalendarSheet from "./calendar_sheet";

export default function useCalendarSheet(year, month, config) {
  let [sheetState, updateSheet] = useState(new CalendarSheet(year, month, config));

  let actions = useMemo(() => {
    let addYears = years => updateSheet(sheet => doAddYears(sheet, years));
    let addMonths = months => updateSheet(sheet => doAddMonths(sheet, months));

    return {
      setYearMonth: yearAndMonth => updateSheet(sheet => doSetYearMonth(sheet, yearAndMonth)),
      subYears: (years) => addYears(-years),
      subMonths: (months) => addMonths(-months),
      addMonths,
      addYears
    };
  }, [updateSheet]);

  return [sheetState, actions];
}

function doSetYearMonth(sheet, {year, month}) {
  year = strictOr(year, sheet.firstDay.getFullYear());
  month = strictOr(month, sheet.firstDay.getMonth());

  return new CalendarSheet(year, month, sheet.config);
}

function doAddYears(sheet, years) {
  let year = sheet.firstDay.getFullYear() + years;
  return doSetYearMonth(sheet, {year});
}

function doAddMonths(sheet, months) {
  let month = sheet.firstDay.getMonth() + months;
  return doSetYearMonth(sheet, {month});
}