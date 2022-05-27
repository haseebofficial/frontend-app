import { findByTestId } from "test/shared/react";

export function selectLanguage(form, {yourLanguage, language}) {
  let lang;
  
  if (yourLanguage) {
    lang = yourLanguage;
    findByTestId(form, `unfold-your-lang`).props.onClick();
    findByTestId(form, `your-language-dropdown-toggle`).props.onClick();
  } else if (language) {
    lang = language;
    findByTestId(form, `language-dropdown-toggle`).props.onClick();
  }

  findByTestId(form, `select-language-${lang}`).props.onClick();
}