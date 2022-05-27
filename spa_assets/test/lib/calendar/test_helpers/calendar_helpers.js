import { fireEvent, within } from "test/support/react_renderer";

export const DATEPICKER_ID = "datepicker";

export function hasDatepicker(element) {
  return !!element.queryByTestId(DATEPICKER_ID);
}

export function selectDate(element, date) {
  fireEvent.click(getDaySelector(element, date));
}

export function getDaySelector(element, date) {
  let datepicker = getDatePicker(element);
  return within(datepicker).getByTestId(dayTestId(date));
}

export function dayTestId(date) {
  return `day-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getDatePicker(element) {
  return element.getByTestId(DATEPICKER_ID);
}
