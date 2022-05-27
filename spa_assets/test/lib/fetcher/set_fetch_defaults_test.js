import test from "tape";
import setFetchDefaults from "fetcher/set_fetch_defaults";
import { failTestOnReject, failTestOnResolve } from "test/shared/promises";

test("fetcher/set_fetch_defaults", function(t) {
  t.test("setFetchDefaults FetchDefaults usage", function(t) {
    let buildResponse = (loc, data) => ({ calledWith: [loc, data], json: () => Promise.resolve(null), ok: true });
    let fetch = (loc, data) => Promise.resolve(buildResponse(loc, data));

    let fetcher = setFetchDefaults({fetch, host: "a/b/", credentials: "include"});

    function testResult({response}) {
      let calledWith = response.calledWith;
      t.same(calledWith, ["a/b/foo/bar", {credentials: "include", a: 1}], "calls fetch function with correctly parsed params");
    }

    fetcher("/foo/bar", {a: 1})
      .then(testResult, failTestOnReject)
      .finally(() => t.end());
  });

  t.test("setFetchDefaults.() result with response.ok: true", function(t) {
    let response = { json: () => Promise.resolve("json"), ok: true };
    let fetch = () => Promise.resolve(response);

    let fetcher = setFetchDefaults({fetch});

    function testResult({response, json}) {
      t.equal(response, response, "resolves promise with correct result.response");
      t.equal(json, "json", "sets result.json based on response.json()");
    }

    fetcher("")
      .then(testResult, failTestOnReject(t))
      .finally(() => t.end());
  });

  t.test("setFetchDefaults.() result with response.ok: false", function(t) {
    let response = { json: () => Promise.resolve("json"), ok: false };
    let fetch = () => Promise.resolve(response);

    let fetcher = setFetchDefaults({fetch});

    function testRejectedResult({response, json}) {
      t.equal(response, response, "resolves promise with correct result.response");
      t.equal(json, "json", "sets result.json based on response.json()");
    }

    fetcher("")
      .then(failTestOnResolve(t), testRejectedResult)
      .finally(() => t.end());
  });

  t.test("setFetchDefaults.() with JSON parse error", function(t) {
    let json = () => { 
      return Promise.resolve().then(() => JSON.parse("aa"));
    };

    let response = { json, ok: true };
    let fetch = () => Promise.resolve(response);

    let fetcher = setFetchDefaults({fetch});

    fetcher("")
      .then(({json}) => t.same(json, {}, "sets result.json to empty object"), failTestOnReject(t))
      .finally(() => t.end());
  });
  
  t.end();
});