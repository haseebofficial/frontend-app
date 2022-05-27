import test from "tape";
import * as stringUtils from "utils/string_utils";

test("stringUtils: isEmpty()", function(t) {
  t.true(stringUtils.isEmpty(""), "true when string is empty");
  t.false(stringUtils.isEmpty(" "), "false when not empty");

  t.end();
});

test("stringUtils: toCamelCase()", function(t) {
  t.equal(stringUtils.toCamelCase("test"), "test");
  t.equal(stringUtils.toCamelCase("test_me"), "testMe");

  t.end();
});

test("stringUtils: capitalize", function(t) {
  t.equal(stringUtils.capitalize("test"), "Test");

  t.end();
});

test("stringUtils: toSnakeCase()", function(t) {
  t.equal(stringUtils.toSnakeCase("testFooBar"), "test_foo_bar");
  t.equal(stringUtils.toSnakeCase("TestFooBar"), "test_foo_bar");

  t.end();
});