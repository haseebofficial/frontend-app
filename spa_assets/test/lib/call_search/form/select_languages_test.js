import test from "tape";
import selectLanguages from "call_search/form/select_languages";
import langs from "./languages";

test("selectLanguages()", function(t) {
  t.test("without yourLanguage", function(t) {
    let result = selectLanguages([ langs.en, langs.ru ]);

    t.equal(result.yourLanguage, "en", "sets yourLanguage to en");
    t.equal(result.language, "ru", "sets language to first available");

    t.end();
  });

  t.test("with yourLanguage", function(t) {
    let result = selectLanguages([ langs.ru, langs.en ], "ru");

    t.equal(result.yourLanguage, "ru", "sets yourLanguage to provided one");
    t.equal(result.language, "en", "sets language to first available");

    t.end();
  });

  t.test("with yourLanguage that is not in list", function(t) {
    let result = selectLanguages([ langs.en, langs.ru ], "de");

    t.equal(result.yourLanguage, "en", "sets yourLanguage to pen");
    t.equal(result.language, "ru", "sets language to first available");

    t.end();
  });

  t.end();
});