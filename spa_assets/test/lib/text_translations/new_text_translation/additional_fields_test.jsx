import test from "test/browser_tape";
import { 
  awaitRequestForm, 
  fillRequestForm,
  submitRequestForm,
  wasRequestFormSubmitted 
} from "test/lib/text_translations/new_text_translation/test_helpers";

test("RequestForm: additional fields", function(t) {
  t.test("requires certain fields", async function(t) {
    let form = await awaitRequestForm();

    fillRequestForm(form, {clientName: ""});
    await submitRequestForm(form);
    t.false(wasRequestFormSubmitted(form));
  
    t.end();
  });
});