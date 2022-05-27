import api from "api_routes";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";

export function mockLanguages(locales) {
  let languages = getLanguages(locales);
  mockJSON(api.languagesPath(), {languages});
}

function getLanguages(locales) {
  locales = locales || ["fr", "fr", "de", "en", "zh", "it", "es", "ar"];

  return locales.map(locale => {
    return { locale };
  });
}