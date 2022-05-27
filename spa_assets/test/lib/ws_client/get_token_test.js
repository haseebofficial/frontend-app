import test from "test/browser_tape";
import { validToken, storeValidToken } from "./token_helpers";
import getToken from "ws_client/get_token";
import AuthJwt from "resources/auth_jwt";

test("ws_client getToken", function(t) {
  t.test("gets token from localStorage", async function(t) {
    let token = storeValidToken();

    t.equal(await getToken(), token);
  
    t.end();
  });

  t.test("gets token from AuthJwt resource", async function(t) {
    let token = validToken();
    AuthJwt.find.mockOnce([], { jwt: token });

    t.equal(await getToken(), token);
  
    t.end();
  });

  t.end();
});