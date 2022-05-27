import test from "tape";
import { failTestOnReject } from "test/shared/promises";
import httpClient from "resources/http_client";

test("httpClient.mockOnce()", function(t) {
  t.test("without mocked location", function(t) {
    t.throws(() => httpClient("asd", {}), /Resource not found/, "throws error");

    t.end();
  });

  t.test("with mocked location", function(t) {
    httpClient.mockOnce({location: "/test", options: {data: 1}, response: 1});
    
    t.throws(() => httpClient("/test", {data: 2}), /Resource not found/, "throws error for non-matching requests");

    function doTest(response) {
      t.equal(response, 1, "resolves with correct response");
      t.throws(() => httpClient("/test", {data: 1}), "actually mocks once");
    }

    httpClient("/test", {data: 1})
      .then(doTest, failTestOnReject(t))
      .finally(() => t.end());
  });

  t.test("multiple mocked locations", function(t) {
    httpClient.mockOnce({location: "/test", options: {data: 1}, response: 1});
    httpClient.mockOnce({location: "/test", options: {data: 2}, response: 2});

    httpClient("/test", {data: 1})
      .then(r => t.equal(r, 1, "saves first location"), failTestOnReject(t))
      .then(() => httpClient("/test", {data: 2}))
      .then(r => t.equal(r, 2, "saves second location"), failTestOnReject(t))
      .finally(() => t.end());
  });

  t.end();
});

test("httpClient.validateAllMocksUsed()", async function(t) {
  httpClient.mockOnce({location: "/test", options: {}, response: 1});

  t.throws(() => httpClient.validateAllMocksUsed(), "throws error when not all mocks are used");
    
  await httpClient("/test", {});

  t.doesNotThrow(() => httpClient.validateAllMocksUsed(), "doesn't throw error when all mocks are used");

  t.end();
});