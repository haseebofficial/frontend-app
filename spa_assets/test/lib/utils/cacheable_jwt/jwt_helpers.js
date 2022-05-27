import jwt from "jsonwebtoken";

export function validToken() {
  return jwt.sign({token: "valid"}, "test", {expiresIn: "2h"});
}

export function expiredToken() {
  return jwt.sign({token: "expired"}, "test", {expiresIn: "-2h"});
}

export function storeToken(tokenId, token) {
  window.localStorage.setItem(tokenId, token);

  return token;
}