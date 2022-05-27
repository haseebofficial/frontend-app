import test from "test/browser_tape";
import { act, cleanup, renderHook, current } from "test/support/react_hooks_renderer";

test("react hooks renderer", function(t) {
  t.test("basic usage", function(t) {
    t.test("re-exports everything from @testing-libarary's renderer", function(t) {
      t.equal(typeof act, "function");
      t.equal(typeof renderHook, "function");
      t.equal(typeof cleanup, "function");

      t.end();
    });
  });

  t.test("current()", function(t) {
    t.test("returns hook's current value", function(t) {
      let useOne = () => 1;
      let hook = renderHook(() => useOne());

      t.equal(current(hook), 1);
  
      t.end();
    });
  });
});