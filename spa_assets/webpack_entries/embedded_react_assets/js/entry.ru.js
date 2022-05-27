import { mutateAppTranslations, mutateAppLocale } from "i18n";
import ruTranslations from "locales/ru";
mutateAppLocale("ru");
mutateAppTranslations(ruTranslations);
import "initialize_embedded_react_assets";