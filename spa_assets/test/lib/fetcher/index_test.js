import test from "tape";
import { failTestOnReject, failTestOnResolve } from "test/shared/promises";

import Fetcher from "fetcher";

const LOCATION_NOT_FOUND = /Location not found/;

test("fetcher№fetchApi in test ENV", function(t) {
  t.test("fetch without mocked location", function(t) {
    let fetcher = new Fetcher();
    t.throws(() => fetcher.fetchApi("not_mocked"), LOCATION_NOT_FOUND, "throws correct error");
    
    t.end();
  });

  t.test("fetcher.fetchApi.mockOnce() json", function(t) {
    let fetcher = new Fetcher();

    let response = {body: {a: 1}};
    fetcher.fetchApi.mockOnce({location: "api_resource", response});

    fetcher.fetchApi("api_resource")
      .then(testResult, failTestOnReject(t))
      .finally(() => t.end());

    function testResult({json}) {
      t.same(json, {a: 1}, "resolves with  correct {json}");
    }
  });

  t.test("fetcher.fetchApi.mockOnce() response", function(t) {
    let fetcher = new Fetcher();

    let response = {body: {}, status: 404};
    fetcher.fetchApi.mockOnce({location: "api_resource", response});

    fetcher.fetchApi("api_resource")
      .then(failTestOnResolve, testResult)
      .finally(() => t.end());

    function testResult({response}) {
      t.equal(response.ok, false, "resolves with  correct {response}");
      t.equal(response.status, 404, "resolves with  correct {response}");
    }
  });

  t.test("fetcher.fetchApi.mockOnce() request body", function(t) {
    let fetcher = new Fetcher();

    let response = {body: {response: 123}};

    fetcher.fetchApi.mockOnce({location: "api_resource", response, request: {body: {a: 1, b: 2}}});

    t.throws(() => fetcher.fetchApi("api_resource"), /Request was missing required body/, 
      "throws error without request body"
    );

    t.throws(() => fetcher.fetchApi("api_resource", {body: {a: 1}}), /Request was missing required body/, 
      "throws error if request body doesn't match"
    );

    fetcher.fetchApi("api_resource", {body: {b:2, a: 1}})
      .then(({json}) => t.same(json, {response: 123}, "returns correct response if body matches"), failTestOnReject(t))
      .finally(() => t.end());
  });

  t.test("fetcher.fetchApi.mockOnce() with request method", function(t) {
    let fetcher = new Fetcher();

    let response = {body: {response: 123}};

    fetcher.fetchApi.mockOnce({location: "api_resource", response, request: {method: "POST"}});

    t.throws(() => fetcher.fetchApi("api_resource"), /Expected request method/, 
      "throws error if request method doesn't match"
    );

    fetcher.fetchApi("api_resource", {method: "POST"})
      .then(({json}) => t.same(json, {response: 123}, "returns correct response if body matches"), failTestOnReject(t))
      .finally(() => t.end());
  });
  
  t.test("fetcher.fetchApi.mockOnce actually mocks once", function(t) {
    let fetcher = new Fetcher();

    fetcher.fetchApi.mockOnce({ location: "api_resource", response: {body: {}} });

    fetcher.fetchApi("api_resource")
      .then(() => {}, failTestOnReject(t))
      .then(testThrows)
      .finally(() => t.end());

    function testThrows() {
      t.throws(() => fetcher.fetchApi("api_resource"), LOCATION_NOT_FOUND, "throws error after first request");
    }
  });

  t.end();
});

test("fetcher#fetchLocal", function(t) {
  t.test("has different mock storage than fetchApi", function(t) {
    let fetcher = new Fetcher();

    let response = {body: {a: 1}};
    fetcher.fetchApi.mockOnce({location: "api_resource", response});

    t.throws(() => fetcher.fetchLocal("api_resource"), LOCATION_NOT_FOUND, "throws correct error");
    
    t.end();
  });

  t.end();
});