// import test from "test/browser_tape";
// import { React, toInstance, Globals, findByTestId } from "test/shared/react";
// import { finishAsyncActions } from "test/shared/promises";
// import { mergeDate } from "utils/date";

// import buildStore from "store";
// import { setCurrentSearch } from "call_search/reducer/actions";

// import CallSearch from "resources/call_search";
// import { setupModal, testShowsModal } from "test/lib/credit_card/modal/shared";

// import { selectLanguage } from "./languages_selector/shared";
// import langs from "./languages";

// import CallSearchForm from "call_search/form";

// test("CallSearchForm without current search", function(t) {
//   t.test("default behaviour", async function(t) {
//     let instance = instanceWithLanguages([ langs.ru ]);

//     let findLoadingEleme = () => findByTestId(instance, "search-form-loading");
//     t.doesNotThrow(findLoadingEleme, "renders `loading` before languages are available");

//     await finishAsyncActions();

//     t.doesNotThrow(() => findByTestId(instance, "call-search-form"), "renders call-search form after");
//     t.throws(findLoadingEleme, "removes `loading` after");

//     t.throws(() => findByTestId(instance, "calendar"), "doesn't show calendar");
    
//     t.end();
//   });

//   t.test("without user language", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     await testSelectsLanguages(t, instance, {lang: "ru", yourLang: "en"});
    
//     t.end();
//   });

//   t.test("with user language", async function(t) {
//     window.localStorage.setItem("locale", "ru");
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     await testSelectsLanguages(t, instance, {lang: "en", yourLang: "ru"});
    
//     t.end();
//   });

//   t.test("changing language", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru, langs.de ]);

//     selectLanguage(instance, {language: "de"});
//     await testSelectsLanguages(t, instance, {lang: "de", yourLang: "en"});
    
//     t.end();
//   });

//   t.test("changing language when lang === current yourLang", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru, langs.de ]);

//     selectLanguage(instance, {language: "en"});
//     await testSelectsLanguages(t, instance, {lang: "en", yourLang: "ru"});
    
//     t.end();
//   });

//   t.test("changing yourLanguage", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru, langs.de ]);

//     selectLanguage(instance, {yourLanguage: "de"});
//     await testSelectsLanguages(t, instance, {lang: "ru", yourLang: "de"});
    
//     t.end();
//   });

//   t.test("changing yourLanguage when current lang === yourLang", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru, langs.de ]);

//     selectLanguage(instance, {yourLanguage: "ru"});
//     await testSelectsLanguages(t, instance, {lang: "en", yourLang: "ru"});
    
//     t.end();
//   });

//   t.test("calendar", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     findByTestId(instance, "show-calendar").props.onClick();
//     t.doesNotThrow(() => findByTestId(instance, "calendar"), "renders calendar on tab click");
//     findByTestId(instance, "hide-calendar").props.onClick();
//     t.throws(() => findByTestId(instance, "calendar"), "hides calendar on tab click");

//     t.end();
//   });

//   t.test("default scheduledAt", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     findByTestId(instance, "show-calendar").props.onClick();

//     let expectedDate = mergeDate(new Date(), { hours: 10, minutes: 0 });
//     CallSearch.create.mockOnce([{ language: "ru", yourLanguage: "en", scheduledAt: expectedDate }], {call_search: {}});

//     findByTestId(instance, "submit-search").props.onClick();
//     await finishAsyncActions();
//     t.pass(`selects correct date for form submit`);

//     t.end();
//   });

//   t.test("selecting scheduledAt", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     findByTestId(instance, "show-calendar").props.onClick();

//     let expectedDate = mergeDate(new Date(), { hours: 11, minutes: 0 });
//     CallSearch.create.mockOnce([{ language: "ru", yourLanguage: "en", scheduledAt: expectedDate }], {call_search: {}});

//     findByTestId(instance, "hour-selector").props.onChange({target: {value: 11}});

//     findByTestId(instance, "submit-search").props.onClick();

//     await finishAsyncActions();
    
//     t.pass(`selects correct date for form submit`);

//     t.end();
//   });

//   t.test("when search is valid", async function(t) {
//     let instance = await waitInstanceWithLanguages([ langs.en, langs.ru ]);

//     CallSearch.create.mockOnce([{ language: "ru", yourLanguage: "en" }], {call_search: {id: 123}});

//     findByTestId(instance, "submit-search").props.onClick();
//     await finishAsyncActions();

//     t.equal(window.location.href, "/call_searches/new", "redirects to created search");
    
//     t.end();
//   });

//   t.test("without credit card", async function(t) {
//     let store = buildStore();
//     let form = await waitInstanceWithLanguages([ langs.en, langs.ru ], {store});
//     let modal = setupModal({store});

//     CallSearch.create.mockOnce([{ language: "ru", yourLanguage: "en" }], {}, {status: 401});

//     findByTestId(form, "submit-search").props.onClick();
//     await finishAsyncActions();
//     testShowsModal(t, modal);

//     t.end();
//   });

//   t.end();
// });

// test("CallSearchForm with current search", function(t) {
//   t.test("immediate call", async function(t) {
//     let instance = await waitInstanceWithSearch({ language: langs.de, your_language: langs.fr, immediate_call: true });
    
//     await testSelectsLanguages(t, instance, { lang: "de", yourLang: "fr" });

//     t.end();
//   });

//   t.test("search with date", async function(t) {
//     let date = new Date(2018, 11, 22, 3, 15);
//     let instance = await waitInstanceWithSearch({ 
//       language: langs.de, your_language: langs.fr, scheduled_at: date, immediate_call: false 
//     });

//     CallSearch.create.mockOnce([{ language: "de", yourLanguage: "fr", scheduledAt: date }], {call_search: {id: 1}});

//     findByTestId(instance, "submit-search").props.onClick();
//     await finishAsyncActions();

//     t.pass(`selects correct date for form submit`);

//     t.end();
//   });
  
//   t.end();
// });

// async function testSelectsLanguages(t, form, langs) {
//   let { lang, yourLang } = langs;
//   let response = {call_search: {id: 1}};
//   CallSearch.create.mockOnce([{ language: lang, yourLanguage: yourLang }], response);

//   findByTestId(form, "submit-search").props.onClick();
//   await finishAsyncActions();

//   t.pass(`selects ${yourLang}-${lang} languages for form submit`);
// }

// function getValidDayInCurrentMonth(date) {
//   let day = date.getDate();

//   if (day >= 28) { ///////
//     return day - 1;
//   } else {
//     return day + 1;
//   }
// }

// function instanceWithLanguages(languages, options) {
//   let store = (options && options.store) || buildStore();
//   CallSearch.Language.list.mockOnce({languages});

//   return createInstance({store});
// }

// async function waitInstanceWithLanguages(languages, options) {
//   let instance = instanceWithLanguages(languages, options);
//   await finishAsyncActions();

//   return instance;
// }

// async function waitInstanceWithSearch(search) {
//   let store = buildStore();
//   store.dispatch( setCurrentSearch(search) );

//   CallSearch.Language.list.mockOnce({languages: []});

//   let instance = createInstance({store});
//   await finishAsyncActions();

//   return instance;
// }

// function createInstance(props) {
//   return toInstance(<FormWithGlobals {...props}/>);
// }

// function FormWithGlobals(props) {
//   return (
//     <Globals {...props}>
//       <CallSearchForm/>
//     </Globals>
//   );
// }