import test from "test/browser_tape";
import { mockLanguages } from "test/lib/languages/test_helpers";
import { ensureLanguagesLoaded } from "languages/lazy_languages_state";

test("languages state", function(t) {
  t.test("initial state", function(t) {
    t.test("sets lazyState value to []", function(t, {store}) {
      let languages = store.getState().lazyLanguages;
      t.same(languages.value, []);
      t.equal(languages.isLoaded, false);

      t.end();
    });
  });

  t.test("ensureLanguagesLoaded", function(t) {
    t.test("loads languages", async function(t, {store}) {
      mockLanguages();
      store.dispatch(ensureLanguagesLoaded());
      await fetch.awaitRequests();
      let languages = store.getState().lazyLanguages;

      t.equal(languages.isLoaded, true);
      t.notEqual(languages.value, undefined);
      t.notSame(languages.value, []);
  
      t.end();
    });
  });
});