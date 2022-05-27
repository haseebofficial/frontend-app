import test from "tape";
import joinPath from "utils/join_path";

test("utils/join_path", function(t) {
  t.test("simple join", function(t) {
    let result = joinPath("foo", "/bar");
    
    t.equal(result, "foo/bar", "joins paths together");

    t.end();
  });

  t.test("join with /paths/", function(t) {
    let result = joinPath("/foo/", "/bar/", "/test/");

    t.equal(result, "/foo/bar/test/", "eliminates '//'s from result");

    t.end();
  });

  t.test("join with paths without dashes", function(t) {
    let result = joinPath("foo", "bar", "test");

    t.equal(result, "foo/bar/test", "joins paths with dash");

    t.end();
  });

  t.test("join with paths with protocol", function(t) {
    let result = joinPath("http://foo.bar/", "/bar");

    t.equal(result, "http://foo.bar/bar", "doesn't replace dashes in protocol");

    t.end();
  });
  
  t.end();
});