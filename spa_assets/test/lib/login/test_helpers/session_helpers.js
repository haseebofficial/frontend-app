import currentUser from "login/login_state/current_user";
import Cookies from "js-cookie";
import { signIn  } from "login/login_state";

export function signInUser(store, userData={}) {
  store.dispatch(signIn(addDefaultUserFileds(userData)));
}

export function getCurrentUser(store) {
  return store.getState().login.currentUser;
}

export function storeUserCookie(userData) {
  let cookie = JSON.stringify(addDefaultUserFileds(userData));
  Cookies.set(currentUser.COOKIE_NAME, cookie);
}

function addDefaultUserFileds(user) {
  return Object.assign({}, {name: "John", surname: "Smith", id: 1, role: "interpreter"}, user);
}