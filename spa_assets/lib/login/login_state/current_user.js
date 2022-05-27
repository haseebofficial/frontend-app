import Cookies from "js-cookie";
const COOKIE_NAME = "current_user";

function getCurrentUser() {
  let userCookie = Cookies.get(COOKIE_NAME);
  if (userCookie) {
    return tryParse(userCookie);
  } else {  
    return null;
  }
}

function tryParse(json) {
  try {
    return JSON.parse(json);
  } catch(e) {
    return null;
  }
}

export default { get: getCurrentUser, COOKIE_NAME };