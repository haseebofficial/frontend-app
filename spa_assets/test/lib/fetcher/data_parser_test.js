import test from "tape";
import FetchDefaults from "fetcher/fetch_defaults";

test("fetcher/fetch_defaults", function(t) {
  t.test("FetchDefaults#getData defaults", function(t) {
    let parser = new FetchDefaults();
    let result = parser.getData("/foo/bar", {a: 1});

    t.equal(result.location, "/foo/bar", "sets location to provided one");
    t.same(result.data, {a: 1}, "sets data to provided one");
    
    t.end();
  });

  t.test("FetchDefaults#getData with {host} constructor option", function(t) {
    let parser = new FetchDefaults({host: "test.com/"});
    let result = parser.getData("/a/bcd");

    t.equal(result.location, "test.com/a/bcd", "correctly joins host with location");

    t.end();
  });

  t.test("FetchDefaults#getData with {credentials} constructor option", function(t) {
    let parser = new FetchDefaults({credentials: "include"});
    let oldData = {a: 1, credentials: 2};

    let result = parser.getData("", oldData);

    t.same(result.data, {credentials: "include", a: 1}, "adds credentials to fetch data");
    t.same(oldData, {a: 1, credentials: 2}, "doesn't modify passed data object");

    t.end();
  });

  t.test("FetchDefaults#getData {contentType} 'json'", function(t) {
    let parser = new FetchDefaults({contentType: "json"});

    let oldData = {headers: {a: 1}};
    let result = parser.getData("", oldData);

    let resultHeaders = result.data.headers;

    t.same(resultHeaders["Content-Type"],"application/json; charset=utf-8", "sets json content-type");
    t.equal(resultHeaders.a, 1, "adds any additional headers to result");
    t.same(oldData, {headers: {a: 1}}, "doesnt modify passed data object");
    
    t.end();
  });

  t.test("FetchDefaults#getData with {headers} constructor option", function(t) {
    let parser = new FetchDefaults({headers: {a: "new"}});
    let oldData = {headers: {a: 1, b: 2}, a: 1};

    let result = parser.getData("", oldData);

    t.same(result.data, {headers: {a: "new", b: 2}, a: 1}, "merges data.headers object with provided one");
    t.same(oldData, {headers: {a: 1, b: 2}, a: 1}, "doesn't modify passed data object");

    t.end();
  });

  t.test("FetchDefaults#getData with {headers:function} constructor option", function(t) {
    let parser = new FetchDefaults({ headers: () => ({a: "new"}) });
    let oldData = {headers: {a: 1, b: 2}, a: 1};

    let result = parser.getData("", oldData);

    t.same(result.data, {headers: {a: "new", b: 2}, a: 1}, "merges data.headers object with provided one");
    
    t.end();
  });

  t.test("FetchDefaults#getData with {body} object", function(t) {
    let parser = new FetchDefaults();
    let result = parser.getData("", {body: {a: 1}});

    t.same(result.data, {body: JSON.stringify({a: 1})}, "stringifies body");
    
    t.end();
  });

  t.test("FetchDefaults#getData with {body} string", function(t) {
    let parser = new FetchDefaults();
    let result = parser.getData("", {body: "foo"});

    t.same(result.data, {body: "foo"}, "returns body unchanged");
    
    t.end();
  });

  t.end();
});