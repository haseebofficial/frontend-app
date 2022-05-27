import test from "test/browser_tape";
import React, { useEffect } from "react";
import { nextTick } from "test/support/event_loop";
import { render } from "test/support/react_renderer";

test("browser_tape", async function(t) {
  t.test("fetch reset", async function(t) {
    t.test("resets fetch before nested tests", async function(t) {
      function consumeFetchMockBeforeTestEnds() {
        return fetch(...arguments);
      }

      fetch.mockOnce("test.com", {});
      await consumeFetchMockBeforeTestEnds("test.com");

      t.test("", async function(t) {
        t.doesNotThrow(() => fetch.mockOnce("test.com", {}));
        await consumeFetchMockBeforeTestEnds("test.com");
        t.end();
      });
    });

    t.test("fails on test end if not all fetch mocks were consumed", function(t) {
      fetch.mockOnce("test.com", {});

      assertTestFails(t, () => t.end(), /fetch mocks/);
    });
  });

  t.test("test context", function(t) {
    t.test("provides store", function(t, {store}) {
      t.notEqual(store.getState(), undefined);
  
      t.end();
    });
  });

  t.test("localStorage reset", function(t) {
    t.test("resets localStorage between tests", function(t) {
      localStorage.setItem("test", "bar");

      t.test("", function(t) {
        t.equal(localStorage.getItem("test"), null);
        t.end();
      });
    });
  });

  t.test("sessionStorage reset", function(t) {
    t.test("resets sessionStorage between tests", function(t) {
      sessionStorage.setItem("test", "bar");
      t.test("", function(t) {
        t.equal(sessionStorage.getItem("test"), null);
        t.end();
      });
    });
  });

  t.test("testing-libarary renderer", function(t) {
    t.test("configures testid selector", function(t) {
      function Foo() { return <div testid="foo"/>; }
      let foo = render(<Foo/>);

      t.notEqual(foo.queryByTestId("foo"), null);
  
      t.end();
    });

    t.test("unmounts elements between tests", function(t) {
      let isUnmounted = false;
      function CheckUnmount() {
        useEffect(() => () => isUnmounted = true);
        return null;
      }
      render(<CheckUnmount/>);

      t.test("", function(t) {
        t.equal(isUnmounted, true);
        t.end();
      });
    });
  });

  t.test("fakeClock context", function(t) {
    t.test("freezes timers on demand", function(t, {fakeClock}) {
      let clock = fakeClock();
      let a = 0;
      setTimeout(() => a += 1, 0);

      clock.next();

      t.equal(a, 1);
  
      t.end();
    });

    t.test("resets clock mocks between tests", async function(t) {
      let a = 0;
      setTimeout(() => a += 1, 0);
      await nextTick();
      t.equal(a, 1);
    
      t.end();
    });


    t.test("resets fakeClock between tests", function(t, {fakeClock}) {
      fakeClock();

      t.test("description", function(t, {fakeClock}) {
        let clock = fakeClock();
        let a = 0;
        setTimeout(() => a += 1, 0);

        clock.next();

        t.equal(a, 1);
      
        t.end();
      });
    });
  });
});

function assertTestFails(t, doTest, errorMatch) {
  let oldFail = t.fail;

  t.fail = (message) => {
    t.true(message.match(errorMatch), `fails test with ${errorMatch} message`);
    t.fail = oldFail;
  };

  doTest();
}