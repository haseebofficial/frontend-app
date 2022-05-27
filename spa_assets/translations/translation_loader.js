import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import glob from "glob";
import locales, { availableLocales } from "i18n/locales";
import { merge } from "utils/object_utils";

export function loadTranslations(folder) {
  let translations = {};
  availableLocales.forEach(locale => translations[locale] = {});

  folder = path.join(folder, "/**/*.{yml,yaml}");
  glob.sync(folder).forEach(file => {
    let locale = localeFromFileName(file);
    if (!locale) throw noLocaleInFileNameError(file);

    let fileYaml = loadYaml(file);
    translations[locale] = merge({}, translations[locale], fileYaml);
  });

  let defaultTranslations = translations[locales.default];
  eachLocaleTranslations(translations, (locale, localeTranslations) => {
    translations[locale] = merge({}, defaultTranslations, localeTranslations);
  });

  return translations;
}

function localeFromFileName(file) {
  let allLocales = availableLocales.join("|");
  let localeRegex = new RegExp(`\\.(${allLocales})\\.ya?ml$`);
  let localeMatch = file.match(localeRegex);

  return localeMatch && localeMatch[1];
}

function eachLocaleTranslations(translations, cb) {
  Object.entries(translations).forEach(([l, t]) => cb(l, t));
}

function loadYaml(file) {
  return yaml.safeLoad(fs.readFileSync(file, "utf8", {filename: file}));
}

function noLocaleInFileNameError(fileName) {
  return new Error(`Cannot load translations from a file "${fileName}", ` +
            `Make sure the filename matches "file.{locale}.yml" pattern, e.g "file.en.yml". ` +
            `Available locales are: ${availableLocales}`);
}