import { set, addDays, addHours, addMinutes } from "date-fns";
import { useState, useMemo } from "react";

export default function usePickedDate(initialDate) {
  let [dateState, setDate] = useState(initialDate);

  let actions = useMemo(() => {
    let addDays = (days) => setDate(d => doAddDays(d, days));
    let addSameDayHours = (hours) => setDate(d => doAddSameDayHours(d, hours));
    let addSameHourMinutes = (minutes) => setDate(d => doAddSameHourMinutes(d, minutes));

    return {
      overwriteDate: (date) => setDate(date),
      setDateFrom: (sourceDate) => setDate(d => doSetDateFrom(sourceDate, d)),
      setValues: (values) => setDate(d => doSetValues(d, values)),
      subDays: (days) => addDays(-days),
      subSameDayHours: (hours) => addSameDayHours(-hours),
      subSameHourMinutes: (minutes) => addSameHourMinutes(-minutes),
      addSameDayHours,
      addSameHourMinutes,
      addDays
    };
  }, [setDate]);

  return {date: dateState, actions};
}

function doSetDateFrom(source, target) {
  return doSetValues(target, { 
    year: source.getFullYear(), 
    month: source.getMonth(),
    date: source.getDate()
  });
}

function doAddDays(date, days) {
  return addDays(date, days);
}

function doAddSameDayHours(date, hours) {
  let newDate = addHours(date, hours);
  return doSetValues(date, {hours: newDate.getHours()});
}

function doAddSameHourMinutes(date, minutes) {
  let newDate = addMinutes(date, minutes);
  return doSetValues(date, {minutes: newDate.getMinutes()});
}

function doSetValues(date, values) {
  return set(date, values);
}
