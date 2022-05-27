import test from "tape";
import { inspect, inspectFunctionCall } from "utils/inspect_utils";

test("inspectUtils: inspect", function(t) {
  t.equal(inspect("test"), "\"test\"", "inspects strings");
  t.equal(inspect(undefined), "undefined", "inspects undefined");
  t.equal(inspect(null), "null", "inspects null");
  t.equal(inspect([1, "test"]), '[1, "test"]', "inspects arrays");
  t.equal(inspect({}), "{}", "inspects empty objects");
  t.equal(inspect({a: 1, b: 2}), "{ a: 1, b: 2 }", "inspects non-empty objects");

  t.test("delegates to inspect() for non-plain objects", function(t) {
    class Dog { inspect() { return `Dog{name: ${this.name}}`; }}
    let dog = new Dog;
    dog.name = "Dex";

    t.equal(inspect(dog), "Dog{name: Dex}");

    t.end();
  });

  t.test("delegates to toString() if inspect() is undefined", function(t) {
    class Dog { toString() { return this.name; }}
    let dog = new Dog;
    dog.name = "Dex";

    t.equal(inspect(dog), "Dex");

    t.end();
  });

  t.end();
});

test("inspectUtils: inspectFunctionCall", function(t) {
  t.test("inspects function calls without args", function(t) {
    t.equal(inspectFunctionCall("test"), "test()");
  
    t.end();
  });

  t.test("inspects function calls with args", function(t) {
    t.equal(inspectFunctionCall("test", 1, [1, 2]), "test(1, [1, 2])");
  
    t.end();
  });

  t.end();
});