import { React, toInstance } from "test/shared/react";
import I18n from "railsy-i18n";
import * as allLocales from "locales/all";

export function testTranslations(Component, props, {locales, t}) {
  // props = Object.assign({}, props);
  
  // locales.forEach(l => {
  //   let translations = allLocales[l];
  //   let i18n = new I18n.Strict(translations, {scope: l});

  //   props.i18n = i18n;
  //   props.globals = { i18n };

  //   t.doesNotThrow(() => toInstance(<Component {...props}/>), `renders ${l} locale without errors`);
  // });
}

export function stubI18n() {
  return new I18n({});
}