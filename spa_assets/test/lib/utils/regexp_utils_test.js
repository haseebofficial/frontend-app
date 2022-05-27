import test from "tape";
import * as regexpUtils from "utils/regexp_utils";

test("regexpUtils: escapeString", function(t) {
  t.test("escapes regex characters in string", function(t) {
    let resultRegexp = new RegExp(regexpUtils.escapeString("atest*"));
    let match = "atest*".match(resultRegexp);

    t.equal(match[0], "atest*");
  
    t.end();
  });

  t.end();
});

test("regexpUtils: listMatches", function(t) {
  t.test("lists all matches in string", function(t) {
    let result = regexpUtils.listMatches("test", /[\w]/g);

    t.equal(result.length, 4);
    t.same(result.map(m => m[0]), ["t", "e", "s", "t"]);
  
    t.end();
  });

  t.test("throws if provided regexp is not global", function(t) {
    t.throws(() => regexpUtils.listMatches("", /.*/), /global/);
  
    t.end();
  });

  t.end();
});