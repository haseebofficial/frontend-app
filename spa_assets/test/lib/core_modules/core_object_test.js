import test from "test/browser_tape";
import * as CoreObject from "core_modules/core_object";

test("CoreObject", function(t) {
  t.test("get", function(t) {
    t.equal(CoreObject.get({a: 1}, "a"), 1, "returns value");
    t.equal(CoreObject.get({}, "a", "default"), "default", "returns default if value is undefined");
    t.equal(CoreObject.get({a: false}, "a"), false, "works with falsy values");

    t.end();
  });

  t.test("hasKey", function(t) {
    t.equal(CoreObject.hasKey({a: 1}, "a"), true, "true if key is present");
    t.equal(CoreObject.hasKey({}, "a"), false, "false if key is not prensent");
  
    t.end();
  });

  t.test("put", function(t) {
    t.test("puts key-value pair into map without mutating the original", function(t) {
      let original = {a: 1, b: 2};
      let result = CoreObject.put(original, "b", 3);
      
      t.same(original, {a: 1, b: 2});
      t.same(result, {a: 1, b: 3});
    
      t.end();
    });
  
    t.end();
  });

  t.test("isPlainObject", function(t) {
    t.equal(CoreObject.isPlainObject({a: 1}), true, "true for plain objects");
    t.equal(CoreObject.isPlainObject([]), false, "false for non-plain objects");

    t.end();
  });

  t.test("isEqual", function(t) {
    t.equal(CoreObject.isEqual({a: 1}, {}), false, "false if objects aren't equal");
    t.equal(CoreObject.isEqual({a: {b: 2}}, {a: {b: 2}}), true, "true if objects are equal");
  
    t.end();
  });
});