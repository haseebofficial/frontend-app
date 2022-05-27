import test from "tape";
import sinon from "sinon";
import { nextTick } from "./event_loop";

test("support/event_loop: nextTick()", function(t) {
  t.test("waits until next event loop tick", async function(t) {
    let spy = sinon.spy();
    setTimeout(spy, 0);

    t.false(spy.called);
    await nextTick();
    t.true(spy.called);
  
    t.end();
  });

  t.end();
});