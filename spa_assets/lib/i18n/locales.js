import * as arrayUtils from "utils/array_utils";

let availableLocales = ["de", "en", "ru", "zh", "fr", 'es', "it", "ar", "ja"];

let locales = arrayUtils.toObject(availableLocales, l => [l, l]);
locales.default = locales.en;

export default locales;
export { availableLocales };