import test from "test/browser_tape";
import deepTransformObject from "improved_fetch/utils/deep_transform_object";

test("improved_fetch utils: deepTransformObject", function(t) {
  function addToKey(addition) {
    return ([k, v]) => [k + addition, v];
  }

  t.test("applies transformation to each entry in object", function(t) {
    let body = {foo: "bar"};
    let result = deepTransformObject(body, addToKey("_test"));
    t.same(result, {foo_test: "bar"});

    t.end();
  });

  t.test("transforms objects inside array", function(t) {
    let body = [{foo: "bar"}];
    let result = deepTransformObject(body, addToKey("_test"));

    t.same(result, [{"foo_test": "bar"}]);
  
    t.end();
  });

  t.test("returns non-object/non-array unchanged", function(t) {
    let body = "foobar";
    let result = deepTransformObject(body, addToKey("_test"));

    t.equal(result, body);
  
    t.end();
  });

  t.test("transforms keys in nested objects", function(t) {
    let body = {foo: {bar: 1}};
    let result = deepTransformObject(body, addToKey("_test"));

    t.same(result, {foo_test: {bar_test: 1}});
  
    t.end();
  });

  t.test("transforms objects/arrays/values inside body", function(t) {
    let body = {foo: [{bar: 1}, 2], test: "123"};
    let result = deepTransformObject(body, addToKey("_test"));

    t.same(result, {foo_test: [{bar_test: 1}, 2], test_test: "123"});
  
    t.end();
  });
});