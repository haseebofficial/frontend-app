import test from "test/browser_tape";
import { toStrictBool, strictOr } from "utils/bool_utils";

test("Bool utils", function(t) {
  t.test("toStrictBool", function(t) {
    t.test("converst null/undefined/false to false", function(t) {
      t.equal(toStrictBool(null), false);
      t.equal(toStrictBool(undefined), false);
      t.equal(toStrictBool(false), false);

      t.end();
    });

    t.test("converts everything else to true", function(t) {
      t.equal(toStrictBool(""), true);
      t.equal(toStrictBool(0), true);
      t.equal(toStrictBool(NaN), true);
      t.equal(toStrictBool(true), true);

      t.end();
    });
  });

  t.test("strictOr", function(t) {
    t.test("returns first strictly true value", function(t) {
      t.equal(strictOr(false, 1, null), 1);
      t.equal(strictOr(false, null, ""), "");
  
      t.end();
    });

    t.test("returns last value", function(t) {
      t.equal(strictOr(false, undefined, undefined, null), null);
    
      t.end();
    });
  });
});