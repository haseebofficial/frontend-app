import test from "test/browser_tape";
import React from "react";
import { addMonths, subDays, subMonths, startOfMonth } from "date-fns";
import { render, fireEvent } from "test/support/react_renderer";
import { InAppPage } from "test/lib/app/test_helpers";
import { selectDate, dayTestId, DATEPICKER_ID } from "test/lib/calendar/test_helpers";
import { DatePicker, usePickedDate } from "calendar";

const JULY_25 = new Date(2020, 6, 25);
const JUNE_30 = new Date(2020, 5, 30);

function renderDatePicker(opts={}) {
  let {futureOnly, date} = opts;
  date = date || JULY_25;

  let dateContainer = {};
  function DatePickerUser() {
    let pickedDate = usePickedDate(date);
    dateContainer.date = pickedDate.date;
    return <DatePicker futureOnly={futureOnly} pickedDate={pickedDate}/>;
  }

  let picker = render(<InAppPage><DatePickerUser/></InAppPage>);
  return [picker, dateContainer];
}

test("DatePicker", function(t) {
  t.test("basic usage", function(t) {
    t.test("displays datepicker sheet", function(t) {
      let [picker] = renderDatePicker();

      t.true(picker.queryByTestId(DATEPICKER_ID));
      t.true(picker.queryByTestId(dayTestId(JULY_25)));

      t.end();
    });

    t.test("changes month on next-month arrow click", function(t) {
      let [picker] = renderDatePicker();
      let nextMonth = addMonths(JULY_25, 1);

      fireEvent.click(picker.getByTestId("next-month"));
      t.true(picker.queryByTestId(dayTestId(nextMonth)));
    
      t.end();
    });

    t.test("changes month on prev-month arrow click", function(t) {
      let [picker] = renderDatePicker();
      let prevMonth = addMonths(JULY_25, -1);

      fireEvent.click(picker.getByTestId("prev-month"));
      t.true(picker.queryByTestId(dayTestId(prevMonth)));
    
      t.end();
    });

    t.test("changes date on day click", function(t) {
      let [picker, usedDate] = renderDatePicker();

      let july_23 = subDays(JULY_25, 2);
      selectDate(picker, july_23);
      t.equal(usedDate.date.getDate(), 23);
    
      t.end();
    });

    t.test("doesn't change date if day from other month is clicked", function(t) {
      let [picker, usedDate] = renderDatePicker();

      selectDate(picker, JUNE_30);
      t.equal(usedDate.date.getDate(), 25);
    
      t.end();
    });

    t.test("changes date if day is clicked on other month's sheet", function(t) {
      let [picker, usedDate] = renderDatePicker();

      fireEvent.click(picker.getByTestId("prev-month"));
      selectDate(picker, JUNE_30);
      t.equal(usedDate.date.getDate(), 30);
    
      t.end();
    });
  });

  t.test("futureOnly setting", function(t) {
    t.test("disables prev-month arrow on current month's sheet", function(t) {
      let now = new Date();
      let [picker] = renderDatePicker({futureOnly: true, date: now});

      fireEvent.click(picker.getByTestId("prev-month"));
      let prevMonth = startOfMonth(subMonths(now, 1));
      t.false(picker.queryByTestId(dayTestId(prevMonth)));
    
      t.end();
    });

    t.test("enables prev-month arrow on future month's sheets", function(t) {
      let [picker] = renderDatePicker({futureOnly: true, date: new Date()});

      fireEvent.click(picker.getByTestId("next-month"));
      t.true(picker.queryByTestId("prev-month"));
    
      t.end();
    });

    t.test("disables past days selection", function(t) {
      let now = new Date();
      let [picker, usedDate] = renderDatePicker({futureOnly: true, date: now});

      selectDate(picker, subDays(now, 1));
      t.equal(usedDate.date.getDate(), now.getDate());
    
      t.end();
    });
  });
});