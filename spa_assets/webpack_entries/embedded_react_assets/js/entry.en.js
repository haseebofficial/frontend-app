import { mutateAppTranslations, mutateAppLocale } from "i18n";
import enTranslations from "locales/en";
mutateAppLocale("en");
mutateAppTranslations(enTranslations);
import "initialize_embedded_react_assets";