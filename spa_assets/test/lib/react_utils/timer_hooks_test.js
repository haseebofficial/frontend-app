import test from "test/browser_tape";
import sinon from "sinon";
import { renderHook } from "@testing-library/react-hooks";
import { useInterval, useTimeout } from "react_utils/timer_hooks";

test("reactUtils: timer_hooks", function(t) {
  t.test("useInterval", function(t) {
    t.test("executes provided callback", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();

      renderHook(() => useInterval(callback, 1000));
      clock.tick(4000);

      t.equal(callback.callCount, 4);

      t.end();
    });

    t.test("cleans up interval on unmount", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();

      let hook = renderHook(() => useInterval(callback, 1000));
      clock.tick(1000);

      hook.unmount();
      clock.tick(2000);

      t.equal(callback.callCount, 1);

      t.end();
    });

    t.test("doesn't restart timer if new callback is passed", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback_1 = sinon.spy();
      let callback_2 = sinon.spy();
      let callback = callback_1;

      let hook = renderHook(() => useInterval(callback, 1000));
      clock.tick(500);

      callback = callback_2;
      hook.rerender();
      clock.tick(1500);

      t.equal(callback_1.callCount, 0);
      t.equal(callback_2.callCount, 2);

      t.end();
    });

    t.test("restarts timer if new interval is passed", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();
      let interval = 1000;

      let hook = renderHook(() => useInterval(callback, interval));
      clock.tick(400);

      interval = 500;
      hook.rerender();

      clock.tick(1100);

      t.equal(callback.callCount, 2);

      t.end();
    });

    t.test("stops timer if {stopped: true} option is passed", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();
      let options = undefined;

      let hook = renderHook(() => useInterval(callback, 1000, options));
      clock.tick(1000);

      options = { stopped: true };
      hook.rerender();
      clock.tick(2550);

      t.equal(callback.callCount, 1);

      t.end();
    });
  });

  t.test("useTimeout", function(t) {
    t.test("runs callback once after specified timeout", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();

      renderHook(() => useTimeout(callback, 1000));
      clock.tick(2000);

      t.equal(callback.callCount, 1);
    
      t.end();
    });

    t.test("behaves like useInterval", function(t, {fakeClock}) {
      let clock = fakeClock();
      let callback = sinon.spy();

      let hook = renderHook(() => useTimeout(callback, 1000));
      clock.tick(500);

      hook.unmount();
      clock.tick(1500);

      t.equal(callback.callCount, 0);

      t.end();
    });
  });
});