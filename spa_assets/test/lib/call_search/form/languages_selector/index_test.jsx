import test from "test/browser_tape";
import { strict } from "test/shared/utils";
import { buildSpyOnce } from "test/shared/mocks";
import { React, toInstance, findByTestId } from "test/shared/react";
import langs from "../languages";
import { selectLanguage } from "./shared";
import { stubI18n } from "test/shared/translations";

import LanguagesSelector from "call_search/form/languages_selector";

function strictCommands() {
  return strict({ selectYourLang: 1, selectLang: 1 });
}

test("LanguagesSelector", function(t) {
  t.test("basic usage", function(t) {
    let languages = [ langs.en, langs.ru, langs.de, langs.fr ];
    let state = strict({language: "de", yourLanguage: "fr"});
    let i18n = stubI18n();
    let form = toInstance(<LanguagesSelector languages={languages} commands={strictCommands()} state={state} i18n={i18n}/>);

    t.doesNotThrow(() => findByTestId(form, "language-selector"), "renders language-selector");

    let selectedLang = findByTestId(form, "selected-lang").props.value;
    t.equal(selectedLang, "de", `selects "de" as language`);

    let selectedYourLang = findByTestId(form, "selected-your-lang").props.value;
    t.equal(selectedYourLang, "fr", `selects "fr" as yourLanguage`);
    
    t.end();
  });

  t.test("language dropdown", function(t) {
    behavesLikeDropdown(t, "language");

    t.end();
  });


  t.test("yourLanguage dropdown", function(t) {
    behavesLikeDropdown(t, "your-language");

    t.end();
  });

  function behavesLikeDropdown(t, dropdownName) {
    let languages = [ langs.ru, langs.en ];
    let state = { language: "en", yourLanguage: "ru" };
    let i18n = stubI18n();
    let form = toInstance(<LanguagesSelector languages={languages} commands={{}} state={state} i18n={i18n}/>);

    if (dropdownName === 'your-language') {
      findByTestId(form, `unfold-your-lang`).props.onClick();
    }

    let clickDropdown = () => findByTestId(form, `${dropdownName}-dropdown-toggle`).props.onClick();
    
    clickDropdown();
    t.doesNotThrow(() => findByTestId(form, `${dropdownName}-dropdown`), `shows ${dropdownName} dropdown on click`);
    clickDropdown();
    t.throws(() => findByTestId(form, `${dropdownName}-dropdown`), `hides ${dropdownName} dropdown on click`);
  }

  t.test("language selectors filtering", function(t) {
    let form = setupSelectionTestInstance([ langs.ru, langs.en, langs.de ]);

    findByTestId(form, `language-dropdown-toggle`).props.onClick();

    testHasLanguageSelectors(t, form, ["ru", "de"]);

    t.end();
  });

  t.test("yourLanguage selectors filtering", function(t) {
    let form = setupSelectionTestInstance([ langs.ru, langs.en, langs.de ]);

    findByTestId(form, `unfold-your-lang`).props.onClick();
    findByTestId(form, `your-language-dropdown-toggle`).props.onClick();

    testHasLanguageSelectors(t, form, ["en", "de"]);

    t.end();
  });

  t.test("language selection", function(t) {
    let commands = { selectLang: buildSpyOnce() };
    let form = setupSelectionTestInstance([ langs.ru, langs.en, langs.de ], commands);

    selectLanguage(form, {language: "de"});
    t.same(commands.selectLang.calledWith, ["de"], "calls selectLang command on click");

    t.end();
  });

  t.test("yourLanguage selection", function(t) {
    let commands = { selectYourLang:  buildSpyOnce() };
    let form = setupSelectionTestInstance([ langs.ru, langs.en, langs.de ], commands);

    selectLanguage(form, {yourLanguage: "en"});
    t.same(commands.selectYourLang.calledWith, ["en"], "calls selectYourLang command on click");

    t.end();
  });

  t.test("searching language", function(t) {
    let languages = [ langs.ru, langs.en, langs.de, langs.el ];
    let state = { language: "en", yourLanguage: "ru" };

    let i18n = stubI18n();
    let form = toInstance(<LanguagesSelector languages={languages} commands={{}} state={state} i18n={i18n}/>);
    findByTestId(form, `language-dropdown-toggle`).props.onClick();

    let search = findByTestId(form, "language-search");
    search.props.onChange({target: {value: "g"}});

    t.throws(() => findByTestId(form, "select-language-en"), "removes non-matching options");
    testHasLanguageSelectors(t, form, ["de", "el"]);

    t.end();
  });

  t.end();
});

function setupSelectionTestInstance(languages, commands) {
  commands = commands || {};
  let state = { language: "en", yourLanguage: "ru" };
  let i18n = stubI18n();
  return toInstance(<LanguagesSelector languages={languages} commands={commands} state={state} i18n={i18n}/>);
}

function testHasLanguageSelectors(t, instance, langs) {
  for (let lang of langs) {
    t.doesNotThrow(() => findByTestId(instance, `select-language-${lang}`), `has ${lang} language selector`);
  }
}