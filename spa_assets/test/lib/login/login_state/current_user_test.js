import test from "test/browser_tape";
import Cookies from "js-cookie";
import { storeUserCookie } from "test/lib/login/test_helpers";
import currentUser from "login/login_state/current_user";

test("currentUser", function(t) {
  t.test(".get()", function(t) {
    t.test("returns null by default", function(t) {
      t.equal(currentUser.get(), null);
    
      t.end();
    });

    t.test("returns user from cookie", function(t) {
      storeUserCookie({id: 1});
      t.equal(currentUser.get().id, 1);
    
      t.end();
    });

    t.test("doesn't throw if user cookie is invalid", function(t) {
      Cookies.set(currentUser.COOKIE_NAME, "dasda");
      t.equal(currentUser.get(), null);
    
      t.end();
    });
  });
});