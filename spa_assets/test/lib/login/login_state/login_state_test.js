import test from "test/browser_tape";
import resetStoreState from "new_store/reset_store_state";
import { signInUser, storeUserCookie, getCurrentUser } from "test/lib/login/test_helpers";
import { signOut } from "login/login_state";

test("loginState", function(t) {
  t.test("initial state", function(t) {
    t.test("initializes empty currentUser", function(t, {store}) {
      t.equal(getCurrentUser(store), null);

      t.end();
    });

    t.test("restores user session", function(t, {store}) {
      storeUserCookie({id: 1});
      store.dispatch(resetStoreState());

      t.same(getCurrentUser(store).id, 1);
    
      t.end();
    });
  });

  t.test("signIn", function(t) {
    t.test("logs user in", function(t, {store}) {
      signInUser(store, {id: 1});

      t.equal(getCurrentUser(store).id, 1);
    
      t.end();
    });
  });

  t.test("signOut", function(t) {
    t.test("signs user out and resets store state", function(t, {store}) {
      signInUser(store, {id: 1});
      store.dispatch(signOut());

      t.equal(getCurrentUser(store), null);
    
      t.end();
    });
  });
});