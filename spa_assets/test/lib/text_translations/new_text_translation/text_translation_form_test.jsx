import test from "test/browser_tape";
import { 
  awaitRequestForm, 
  fillRequestForm,
  submitRequestForm,
  mockRequestSubmit, 
  wasRequestFormSubmitted 
} from "test/lib/text_translations/new_text_translation/test_helpers";

test("text translations RequestForm", function(t) {
  t.test("submits request form if all fields are valid", async function(t) {
    let form = await awaitRequestForm();
    let formData = fillRequestForm(form);
    mockRequestSubmit(formData);
    await submitRequestForm(form);

    t.true(wasRequestFormSubmitted(form));
  
    t.end();
  });

  t.test("doesn't submit form twice", async function(t) {
    let form = await awaitRequestForm();
    let formData = fillRequestForm(form);
    mockRequestSubmit(formData);

    submitRequestForm(form);
    submitRequestForm(form);
    await fetch.awaitRequests();

    t.true(wasRequestFormSubmitted(form));
  
    t.end();
  });
});