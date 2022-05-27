import test from "test/browser_tape";
import { fireEvent } from "test/support/react_renderer";
import locales from "i18n/locales";
import { 
  awaitRequestForm, 
  renderRequestForm, 
  wasRequestFormSubmitted, 
  fillRequestForm, 
  submitRequestForm 
} from "test/lib/text_translations/new_text_translation/test_helpers";

function sourceSelect(form) {
  return form.queryByName("sourceLanguage");
}

function targetSelect(form) {
  return form.queryByName("targetLanguage");
}

function changeInput(input, value) {
  fireEvent.change(input, {target: {value}});
}

test("RequestForm: language_selectors", function(t) {
  t.test("SourceLanguageSelect", function(t) {
    t.test("selects current locale as source", async function(t) {
      let form = await awaitRequestForm({langs: [locales.ru, locales.default]});
      t.equal(sourceSelect(form).value, locales.default);

      t.end();
    });

    t.test("can infer sourceLanguage from query", async function(t) {
      let langs = [locales.ru, locales.default, "aa", "af"];
      let form = await awaitRequestForm({
        langs, 
        route: "/translation",
        currentPath: "/translation?source_language=aa"
      });

      t.equal(sourceSelect(form).value, "aa");

      t.end();
    });

    t.test("doesn't allow same target language", async function(t) {
      let form = await awaitRequestForm({langs: [locales.default, locales.ru]});

      changeInput(sourceSelect(form), locales.ru);
      t.equal(sourceSelect(form).value, locales.ru);
      t.equal(targetSelect(form).value, locales.default);
    
      t.end();
    });

    t.test("makes sure query target language doesn't match source", async function(t) {
      let langs = [locales.ru, locales.default, "aa", "af"];
      let form = await awaitRequestForm({
        langs, 
        route: "/translation", 
        currentPath: "/translation?target_language=aa&source_language=aa"
      });

      t.equal(sourceSelect(form).value, locales.default);
      t.equal(targetSelect(form).value, "aa");
    
      t.end();
    });

    t.test("doesn't submit the form if sourceLanguage is blank", async function(t) {
      let form = await awaitRequestForm({langs: ["", locales.default, locales.ru]});
      fillRequestForm(form, {sourceLanguage: ""});
      await submitRequestForm(form);
      
      t.false(wasRequestFormSubmitted(form));

      t.end();
    });

    t.test("doesn't submit the form if languages are still loading", async function(t) {
      let form = renderRequestForm();
      fillRequestForm(form);
      await submitRequestForm(form);
      
      t.false(wasRequestFormSubmitted(form));

      t.end();
    });
  });

  t.test("TargetLanguageSelect", function(t) {
    t.test("selects first non-current locale as target", async function(t) {
      let form = await awaitRequestForm({langs: [locales.default, locales.ru]});

      t.equal(targetSelect(form).value, locales.ru);
    
      t.end();
    });

    t.test("doesn't submit the form if targetLanguage is blank", async function(t) {
      let form = await awaitRequestForm({langs: ["", locales.default, locales.ru]});
      fillRequestForm(form, {targetLanguage: ""});
      await submitRequestForm(form);
      
      t.false(wasRequestFormSubmitted(form));

      t.end();
    });

    t.test("can infer target language from query", async function(t) {
      let langs = [locales.ru, locales.default, "aa", "af"];
      let form = await awaitRequestForm({
        langs, 
        route: "/translation",
        currentPath: "/translation?target_language=af"
      });

      t.equal(targetSelect(form).value, "af");
    
      t.end();
    });

    // t.test("makes sure query target language doesn't match source", async function(t) {
    //   let langs = [locales.ru, locales.default, "aa", "af"];
    //   let form = await awaitRequestForm({langs, currentRoute: "/ads?target_language=ds&source_language=aasd"});
    //   t.notEqual(sourceSelect(form).value, targetSelect(form).value);
    
    //   t.end();
    // });
  });
});