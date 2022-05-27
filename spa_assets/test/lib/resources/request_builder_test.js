import test from "test/browser_tape";
import { local, remote } from "resources/request_builder";

test("local request builder", function(t) {
  t.test(".post() with body", function(t) {
    let { location, options } = local.post("/test", {a: 1});

    t.equal(location, "/test", "sets location");

    t.equal(options.body, JSON.stringify({a: 1}), "stringifies body");
    t.equal(options.method, "POST");
    t.equal(options.headers["Content-Type"], "application/json; charset=utf-8");
    t.equal(options.credentials, "include");

    t.end();
  });

  t.test(".post() without body", function(t) {
    let { options } = local.post("/adas");

    t.equal(options.body, undefined, "doesn't stringify body");

    t.end();
  });

  t.test(".get()", function(t) {
    let { options } = local.get("/test");

    t.equal(options.method, "GET");

    t.end();
  });

  t.test(".get() ignores body", function(t) {
    let { options } = local.get("/test", {foo: "bar"});

    t.false("body" in options);

    t.end();
  });

  t.test(".put()", function(t) {
    let { options } = local.put("/test");

    t.equal(options.method, "PUT");

    t.end();
  });

  t.test(".delete()", function(t) {
    let { options } = local.delete("/test");

    t.equal(options.method, "DELETE");

    t.end();
  });

  t.end();
});

test("remote request builder", function(t) {
  t.test(".post() with body", function(t) {
    window.localStorage.setItem("API_JWT", "MY_JWT");

    let { location, options } = remote.post("/test", {a: 1});

    t.notEqual(location, "/test");
    t.true(/\/test/.test(location), "includes location in joined path");

    t.equal(options.body, JSON.stringify({a: 1}), "stringifies body");
    t.equal(options.method, "POST");
    t.equal(options.headers["Content-Type"], "application/json; charset=utf-8");
    t.equal(options.headers["Authorization"], "Bearer: MY_JWT", "sets Authorization based on localStorage API_JWT");

    t.end();
  });

  t.test(".get() ignores body", function(t) {
    let { options } = remote.get("/test");

    t.equal(options.method, "GET");
    t.false("body" in options);

    t.end();
  });

  t.test(".put()", function(t) {
    let { options } = remote.put("/test");

    t.equal(options.method, "PUT");

    t.end();
  });

  t.test(".delete()", function(t) {
    let { options } = remote.delete("/test");

    t.equal(options.method, "DELETE");

    t.end();
  });

  t.end();
});