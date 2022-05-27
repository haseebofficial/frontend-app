import test from "test/browser_tape";
import path from 'path';
import { loadTranslations } from "translations/translation_loader";

function fixturePath(fixture) {
  return path.resolve(process.cwd(), "test/translations/fixtures", fixture);
}

test("loadTranslations", function(t) {
  t.test("merges all translations for found locales", function(t) {
    let { en: enTranslations } = loadTranslations(fixturePath("en_translations"));
    t.equal(enTranslations.hello, "en_hello");
    t.equal(enTranslations.hello_2, "en_hello_2");
  
    t.end();
  });

  t.test("works for all locales", function(t) {
    let { ru: ruTranslations } = loadTranslations(fixturePath("ru_translations"));
    t.equal(ruTranslations.hello, "ru_hello");
  
    t.end();
  });

  t.test("merges en translations into all other translations", function(t) {
    let { ru: ruTranslations } = loadTranslations(fixturePath("en_ru_translations"));
    t.equal(ruTranslations.hello, "ru_hello");
    t.equal(ruTranslations.en_hello, "en_hello");
  
    t.end();
  });

  t.test("throws if file locale is invalid", function(t) {
    t.throws(() => loadTranslations(fixturePath("invalid_locale_translations")), /locale/);
  
    t.end();
  });
});

