import test from "test/browser_tape";
import { buildSpyOnce } from "test/shared/mocks";
import { validToken, expiredToken, storeToken } from "./jwt_helpers";
import CacheableJwt from "utils/cacheable_jwt";

const TOKEN_ID = "MY_TEST_JWT";

test("CacheableJwt#get", function(t) {
  t.test("gets token from localStorage", async function(t) {
    let fetch = buildSpyOnce();
    let token = storeToken(TOKEN_ID, validToken());

    let actualToken = await CacheableJwt.get(TOKEN_ID, fetch).then((val) => {
      t.pass("returns promise");
      return val;
    });

    t.equal(actualToken, token);
    t.false(fetch.isCalled);
  
    t.end();
  });

  t.test("gets token using provided fetch function", async function(t) {
    let token = validToken();
    let fetch = buildSpyOnce(Promise.resolve(token));

    let actualToken = await CacheableJwt.get(TOKEN_ID, fetch);

    t.equal(actualToken, token);
  
    t.end();
  });

  t.test("stores fetched token in localStorage", async function(t) {
    let token = validToken();
    let fetch = buildSpyOnce(Promise.resolve(token));

    await CacheableJwt.get(TOKEN_ID, fetch);
    let actualToken = await CacheableJwt.get(TOKEN_ID, fetch);

    t.equal(actualToken, token);
  
    t.end();
  });

  t.test("validates stored token's expiry date", async function(t) {
    storeToken(TOKEN_ID, expiredToken());

    let token = validToken();
    let fetch = buildSpyOnce(Promise.resolve(token));

    let actualToken = await CacheableJwt.get(TOKEN_ID, fetch);

    t.equal(actualToken, token);
  
    t.end();
  });

  t.end();
});