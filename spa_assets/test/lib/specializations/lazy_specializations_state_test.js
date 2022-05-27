import test from "test/browser_tape";
import { mockSpecializations } from "test/lib/specializations/test_helpers";
import { ensureSpecializationsLoaded } from "specializations/lazy_specializations_state";

test("specializations state", function(t) {
  t.test("initial state", function(t) {
    t.test("sets lazyState value to []", function(t, {store}) {
      let specializations = store.getState().lazySpecializations;
      t.same(specializations.value, []);
      t.equal(specializations.isLoaded, false);

      t.end();
    });
  });

  t.test("ensureSpecializationsLoaded", function(t) {
    t.test("loads specializations", async function(t, {store}) {
      mockSpecializations();
      store.dispatch(ensureSpecializationsLoaded());
      await fetch.awaitRequests();
      let specializations = store.getState().lazySpecializations;

      t.equal(specializations.isLoaded, true);
      t.notEqual(specializations.value, undefined);
      t.notSame(specializations.value, []);
  
      t.end();
    });
  });
});