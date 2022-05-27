import test from "tape";
import Response from "fetcher/test/response";
import { failTestOnReject, failTestOnResolve } from "test/shared/promises";

test("fetcher/test/response Response constructor", function(t) {
  t.test("Response constructor", function(t) {
    let data = { bar: 1 };
    
    let result = new Response(data);
    t.same(result.bar, 1, "assigns all passed attributes to response Object");

    t.end();
  });

  t.test("Response constructor with status: undefined", function(t) {
    let result = new Response({status: undefined});

    t.equal(result.status, 200, "sets status: 200");
    t.equal(result.ok, true, "sets ok: true");

    t.end();
  });

  t.test("Response constructor with defined status", function(t) {
    function response(status) { return new Response({status: status}); }

    let response300 = response(300);
    t.equal(response300.ok, false, "returns ok: false for non 200-299 status");
    t.equal(response300.status, 300, "sets status to provided one");

    t.equal(response(200).ok, true, "returns ok: true for 200-299 response");

    t.end();
  });

  t.end();
});

test("fetcher/test/response Response#json", function(t) {
  t.test("Response#json with body: object", function(t) {
    let body = {a: 1};
    let response = new Response({body});

    response.json()
      .then( (result) => t.same(result, body, "resolves with correct body object"), failTestOnReject(t) )
      .finally(() => t.end());
  });

  t.test("Response#json with body: valid JSON string", function(t) {
    let body = '{"a":1}';
    let response = new Response({body});

    response.json()
      .then( (result) => t.same(result, {a: 1}, "resolves with correct body object"), failTestOnReject(t) )
      .finally(() => t.end());
  });

  t.test("Response#json with body: invalid JSON string", function(t) {
    let body = 'foobar';
    let response = new Response({body});

    response.json()
      .then( failTestOnResolve(t), () => t.pass("rejects with some JSON parsing error") )
      .finally(() => t.end());
  });

  t.test("Response#json with used body", function(t) {
    testUsedBody(t, "json");
  });

  t.end();
});

test("fetcher/test/response Response#text", function(t) {
  t.test("Response#text with body: string", function(t) {
    let body = 'foobar';
    let response = new Response({body});

    response.text()
      .then( (result) => t.same(result, "foobar", "resolves with correct body string"), failTestOnReject(t) )
      .finally(() => t.end());
  });

  t.test("Response#text with body: object", function(t) {
    let body = {a: 1, b: 2};
    let response = new Response({body});

    response.text()
      .then( (result) => t.same(result, JSON.stringify(body), "resolves with stringified body object"), failTestOnReject(t) )
      .finally(() => t.end());
  });

  t.test("Response#text with used body", function(t) {
    testUsedBody(t, "text");
  });

  t.end();
});

function testUsedBody(t, methodName) {
  let response = new Response({body: {a: "i wont get resolved"}});

  let checkBodyUsed = function(err) {
    t.equal(response.bodyUsed, true, "sets response.bodyUsed to true");
    t.equal(err.message, "Body has already been consumed.", "rejects with 'body has been consumed' message");
  };

  response[methodName]()
    .then(response[methodName])
    .then(failTestOnResolve(t), checkBodyUsed)
    .finally(() => t.end());
}