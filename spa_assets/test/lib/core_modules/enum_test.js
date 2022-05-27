import test from "test/browser_tape";
import * as Enum from "core_modules/enum";

test("Enum", function(t) {
  t.test("find()", function(t) {
    t.test("finds item in array", function(t) {
      let result = Enum.find([1, 2, 3], i => i === 2);
      t.equal(result, 2);

      t.end();
    });

    t.test("finds item in object", function(t) {
      let result = Enum.find({a: 1, b: 1, c: 1}, ([k, v]) => v === 1 && k === "b");

      t.same(result, ["b", 1]);
    
      t.end();
    });
  });

  t.test("map()", function(t) {
    t.test("maps arrays", function(t) {
      let source = [1, 2, 3];
      let result = Enum.map(source, i => i + 1);

      t.same(result, [2, 3, 4]);
      t.same(source, [1, 2, 3]);
  
      t.end();
    });

    t.test("maps objects", function(t) {
      let source = {foo: "bar"};
      let result = Enum.map(source, ([k, v]) => [k + "_test", v + "_test"]);

      t.same(result, {foo_test: "bar_test"});
      t.same(source, {foo: "bar"});
    
      t.end();
    });
  });
});