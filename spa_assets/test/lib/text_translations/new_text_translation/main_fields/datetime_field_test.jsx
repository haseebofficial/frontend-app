import test from "test/browser_tape";
import { fireEvent } from "test/support/react_renderer";
import { addDays } from "date-fns";
import { hasDatepicker } from "test/lib/calendar/test_helpers";
import { 
  awaitRequestForm, 
  wasRequestFormSubmitted, 
  fillRequestForm, 
  submitRequestForm,
  mockRequestSubmit
} from "test/lib/text_translations/new_text_translation/test_helpers";

function datetimeSelect(form) {
  return form.queryByTestId("datetime-select") || 
         form.queryByTestId("datetime-select-empty");
}

function isDatetimeSelectEmpty(form) {
  return !!form.queryByTestId("datetime-select-empty");
}

function toggleDatepicker(form) {
  fireEvent.click(datetimeSelect(form));
}

function clickSelectDatetime(form) {
  toggleDatepicker(form);
  fireEvent.click(form.getByTestId("select-datetime"));
}

test("RequestForm: datetime_field", function(t) {
  t.test("datepicker display", function(t) {
    t.test("toggles datepicker on select field click", async function(t) {
      let form = await awaitRequestForm();

      t.false(hasDatepicker(form));
      toggleDatepicker(form);
      t.true(hasDatepicker(form));
      toggleDatepicker(form);
      t.false(hasDatepicker(form));
    
      t.end();
    });

    t.test("hides datepicker on click outside", async function(t) {
      let form = await awaitRequestForm();

      toggleDatepicker(form);
      fireEvent.click(document.body);
      t.false(hasDatepicker(form));

      t.end();
    });
  });

  t.test("select-datetime button", function(t) {
    t.test("displays non-empty datetime-select on click", async function(t) {
      let form = await awaitRequestForm();

      clickSelectDatetime(form);
      t.false(isDatetimeSelectEmpty(form));
    
      t.end();
    });

    t.test("hides datepicker on select", async function(t) {
      let form = await awaitRequestForm();

      clickSelectDatetime(form);
      t.false(hasDatepicker(form));
    
      t.end();
    });

    t.test("sets dueDate submit value to 10:00 of next day", async function(t) {
      let form = await awaitRequestForm();
      let request = fillRequestForm(form);

      let tomorrow = addDays(new Date(), 1);
      tomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0);
      mockRequestSubmit(Object.assign(request, {dueDate: tomorrow.toISOString()}));

      clickSelectDatetime(form);
      await submitRequestForm(form);
      
      t.true(wasRequestFormSubmitted(form));

      t.end();
    });
  });

  t.test("reset-datetime button", function(t) {
    function resetButton(form) {
      return form.queryByTestId("reset-datetime");
    }

    t.test("is hidden by default", async function(t) {
      let form = await awaitRequestForm();

      fireEvent.click(datetimeSelect(form));
      t.false(resetButton(form));
    
      t.end();
    });

    t.test("is displayed after select-datetime click", async function(t) {
      let form = await awaitRequestForm();

      clickSelectDatetime(form);
      toggleDatepicker(form);
      t.true(resetButton(form));

      t.end();
    });

    t.test("resets datetime on click", async function(t) {
      let form = await awaitRequestForm();

      clickSelectDatetime(form);
      toggleDatepicker(form);
      fireEvent.click(resetButton(form));
      t.true(isDatetimeSelectEmpty(form));

      t.end();
    });

    t.test("hides datepicker on click", async function(t) {
      let form = await awaitRequestForm();

      clickSelectDatetime(form);
      toggleDatepicker(form);
      fireEvent.click(resetButton(form));
      t.false(hasDatepicker(form));

      t.end();
    });
  });
});