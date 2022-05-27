import test from "tape";
import { strict } from "test/shared/utils";

test("test utils strict()", function(t) {
  t.test("behaves like normal object", function(t) {
    let obj = strict({a: 1});

    t.equal(obj.a, 1);
    
    t.end();
  });

  t.test("throws error if property doesnt exist", function(t) {
    let obj = strict({a: 1});

    t.throws(() => obj.b, /Key "b" not found in/);

    t.end();
  });

  t.test("data immutability", function(t) {
    let obj = { a: {} };
    strict(obj);

    t.doesNotThrow(() => obj.a.d, "doesn't turn nested objects within passed object into proxies");

    t.end();
  });

  t.test("nested objects call chain", function(t) {
    let obj = strict({a: {b: {}}});

    t.throws(() => obj.a.c, /Key "a\.c" not found in/, "modifies error message to include call chain 2 levels deep");
    t.throws(() => obj.a.b.c, /Key "a\.b\.c" not found in/, "modifies error message to include call chain 3 levels deep");
    
    t.throws(() => obj.a.b.c, /Key "a\.b\.c" not found in/, "following requests don't change call chain");

    t.end();
  });

  t.test("using strict objects in promises", function(t) {
    let obj = strict({});

    let message = "doesn't throw key 'then' not found error";
    Promise.resolve(obj).then(() => t.pass(message), () => t.fail(message))
      .finally(() => t.end());
  });
  
  t.end();
});