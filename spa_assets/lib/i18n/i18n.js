import I18n from "railsy-i18n";
import locales from "i18n/locales";

let i18n = new I18n({}, { scope: locales.default });

export default i18n;

export let t = i18n.t;

export function getAppLocale() {
  return i18n._defaultScope;
}

export function mutateAppTranslations(newTranslations) {
  i18n._translations = newTranslations;
}

export function mutateAppLocale(newLocale) {
  i18n._defaultScope = newLocale;
}