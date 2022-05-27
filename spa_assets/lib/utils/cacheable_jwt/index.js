import decodeJWT from "jwt-decode";

export default class CacheableJwt {
  static get(tokenId, fetchNewToken) {
    let token = window.localStorage.getItem(tokenId);

    // Caching tokens is disabled in browsers 
    // because there is no way currently to remove it on logout
    if (process.env.NODE_ENV === "test" && token && !isTokenExpired(token)) {
      return Promise.resolve(token);
    } else {
      return fetchNewToken().then(token => {
        window.localStorage.setItem(tokenId, token);

        return token;
      });
    }
  }
}

function isTokenExpired(token) {
  let { exp } = decodeJWT(token);
  let now = Date.now()/1000;

  return now > exp;
}