import test from "test/browser_tape";
import React from "react";
import { render, fireEvent, within } from "test/support/react_renderer";
import { inputValue, changeInput, getInput } from "test/support/form_helpers";
import { InAppPage } from "test/lib/app/test_helpers";
import { TimePicker, usePickedDate } from "calendar";

function renderTimePicker(date) {
  let usedDate = {};
  function UseTimePicker() {
    let pickedDate = usePickedDate(date);
    usedDate.date = pickedDate.date;
    return <TimePicker pickedDate={pickedDate}/>;
  }
  let picker = render(<InAppPage><UseTimePicker/></InAppPage>);
  return [picker, usedDate];
}

function clickIncrement(picker, name) {
  let increment = withinField(picker, name).getByTestId("increment");
  return fireEvent.click(increment);
}

function clickDecrement(picker, name) {
  let decrement = withinField(picker, name).getByTestId("decrement");
  return fireEvent.click(decrement);
}

function withinField(picker, name) {
  return within(picker.queryByTestId(`${name}-field`));
}

test("TimePicker", function(t) {
  t.test("hours input", function(t) {
    t.test("displays formatted hours", function(t) {
      let [picker] = renderTimePicker(new Date(2020, 6, 25, 2, 9));
      t.equal(inputValue(picker, "hours"), "02");

      t.end();
    });

    t.test("updates usedDate's hours on input change", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date());
      changeInput(picker, "hours", "23a");
      t.equal(dateContainer.date.getHours(), 23);
    
      t.end();
    });

    t.test("disables formatting on input focus and enables it on blur", function(t) {
      let [picker] = renderTimePicker(new Date(2020, 6, 25, 22, 9));

      fireEvent.focus(getInput(picker, "hours"));
      changeInput(picker, "hours", "2");
      t.equal(inputValue(picker, "hours"), "2");
      fireEvent.blur(getInput(picker, "hours"));
      t.equal(inputValue(picker, "hours"), "02");
    
      t.end();
    });

    t.test("allows empty input values", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date(2020, 6, 25, 2, 9));

      fireEvent.focus(getInput(picker, "hours"));
      changeInput(picker, "hours", "");
      t.equal(dateContainer.date.getHours(), 0);
      t.equal(inputValue(picker, "hours"), "");
    
      t.end();
    });

    t.test("adds same day hours on increment-hours button click", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date(2020, 2, 2, 23));

      clickIncrement(picker, "hours");
      t.equal(dateContainer.date.getHours(), 0);
    
      t.end();
    });

    t.test("substracts same day hours on decrement-hours button click", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date(2020, 2, 2, 0));

      clickDecrement(picker, "hours");
      t.equal(dateContainer.date.getHours(), 23);
    
      t.end();
    });
  });

  t.test("minutes input", function(t) {
    t.test("displays formatted minutes", function(t) {
      let [picker] = renderTimePicker(new Date(2020, 6, 25, 2, 9));
      t.equal(inputValue(picker, "minutes"), "09");
    
      t.end();
    });

    t.test("updates usedDate's minutes on input change", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date());

      changeInput(picker, "minutes", "59ds");
      t.equal(dateContainer.date.getMinutes(), 59);
    
      t.end();
    });

    t.test("adds same hour minutes on increment-minutes button click", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date(2020, 2, 2, 2, 59));

      clickIncrement(picker, "minutes");
      t.equal(dateContainer.date.getMinutes(), 0);
    
      t.end();
    });

    t.test("substracts same hour minutes on decrement-minutes button click", function(t) {
      let [picker, dateContainer] = renderTimePicker(new Date(2020, 2, 2, 2, 0));

      clickDecrement(picker, "minutes");
      t.equal(dateContainer.date.getMinutes(), 59);
    
      t.end();
    });
  });
});