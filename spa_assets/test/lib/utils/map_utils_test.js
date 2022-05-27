import test from "tape";
import { isEqual, isIncludes, isEmpty } from "utils/map_utils";

test("utils/map_utils isEqual", function(t) {
  t.test("when objects are equal", function(t) {
    let result = isEqual({ b: 2, a: 1 }, { a: 1, b:2 });
    
    t.equal(result, true);
    
    t.end();
  });
  
  t.test("when objects are of different length", function(t) {
    let result = isEqual({ a: 1 }, { a: 1, b: 2 });

    t.equal(result, false);
    
    t.end();
  });

  t.test("when equal objects have nested structure", function(t) {
    let result = isEqual({ a: {a: 1} }, { a: {a: 1} });

    t.equal(result, true);

    t.end();
  });

  t.end();
});

test("utils/map_utils isIncludes", function(t) {
  t.test("when object includes other object", function(t) {
    let result = isIncludes({ a: 1, b: 2 }, { a: 1, b: 2 });

    t.equal(result, true);
    
    t.end();
  });

  t.test("when objects have nested structure", function(t) {
    let result = isIncludes( {a: 1, b: {c: 2} }, { b: {c: 2} });

    t.equal(result, true);
    
    t.end();
  });
  
  t.end();
});

test("utils/map_utils isEmpty", function(t) {
  t.test("true for empty objects", function(t) {
    t.equal(isEmpty({}), true);
  
    t.end();
  });

  t.test("false for non-empty objects", function(t) {
    t.equal(isEmpty({a: 1}), false);
  
    t.end();
  });

  t.end();
});