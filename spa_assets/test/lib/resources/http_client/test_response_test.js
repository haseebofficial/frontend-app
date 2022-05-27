import test from "tape";
import { failTestOnReject, failTestOnResolve } from "test/shared/promises";
import Response from "resources/http_client/test_response";

test("http client Response constructor", function(t) {
  t.test("status: undefined", function(t) {
    let result = new Response({});

    t.equal(result.status, 200, "sets status: 200");
    t.equal(result.ok, true, "sets ok: true");

    t.end();
  });

  t.test("status: int", function(t) {
    function response(status) { return new Response({status: status}); }

    let response300 = response(300);
    t.equal(response300.ok, false, "sets ok: false for non 200-299 status");
    t.equal(response300.status, 300, "sets status to provided one");

    t.equal(response(299).ok, true, "sets ok: true for 200-299 response");

    t.end();
  });
  
  t.end();
});

test("http client Responsejson", function(t) {
  t.test("with body: object", function(t) {
    let body = {a: 1};
    let response = new Response({body});

    response.json()
      .then( (result) => t.same(result, body, "resolves with body"), failTestOnReject(t) )
      .finally(() => t.end());
  });

  t.test("reading body", function(t) {
    let response = new Response({body: {a: 1}});

    let checkBodyUsed = function(err) {
      t.equal(response.bodyUsed, true, "sets response.bodyUsed to true");
      t.equal(err.message, "Body has already been consumed.", "rejects with correct message");
    };

    response.json()
      .then(() => response.json())
      .then(failTestOnResolve(t), checkBodyUsed)
      .finally(() => t.end());
  });

  t.end();
});