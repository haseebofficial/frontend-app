import render from "test/shared/react_renderer";
import I18n from "railsy-i18n";
import * as allLocales from "locales/all";

export function testTranslations(t, component, locales, callback) {
  locales.forEach(l => {
    let translations = allLocales[l];
    let i18n = new I18n.Strict(translations, {scope: l});

    function doTest() {
      let rendered = render(component, { provideGlobals: { i18n } });

      if (callback) { callback(rendered); }
    }

    t.doesNotThrow(doTest, `renders ${l} locale without errors`);
  });
}

export function stubI18n() {
  return new I18n({});
}