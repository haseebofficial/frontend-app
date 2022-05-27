import test from "test/browser_tape";
import { awaitRequestForm, fillRequestForm, submitRequestForm, wasRequestFormSubmitted } from "test/lib/text_translations/new_text_translation/test_helpers";

function specializationsSelect(form) {
  return form.queryByTestId("specializations-select");
}

test("RequestForm: specializations_field", function(t) {
  t.test("renders specializations-select", async function(t) {
    let form = await awaitRequestForm();

    t.true(specializationsSelect(form));

    t.end();
  });

  t.test("doesn't submit the form if specialization is blank", async function(t) {
    let form = await awaitRequestForm();
    fillRequestForm(form, {specialization: ""});
    await submitRequestForm(form);
    
    t.false(wasRequestFormSubmitted(form));

    t.end();
  });
});