import test from "tape";
import { buildSpyOnce, buildStubOnce, buildSpy } from "./index.js";

test("buildSpyOnce()", function(t) {
  t.test("when not called", function(t) {
    let spy = buildSpyOnce();

    t.equal(spy.isCalled, false, "sets isCalled to false");
    
    t.end();
  });
  
  t.test("when called", function(t) {
    let spy = buildSpyOnce();

    spy(1, [2]);

    t.equal(spy.isCalled, true, "sets isCalled to true");
    t.same(spy.calledWith, [1, [2]], "sets calledWith to the list of args");
    
    t.end();
  });

  t.test("when called more than one time", function(t) {
    let spy = buildSpyOnce();

    spy();

    t.throws(spy, /spyOnce was already called/, "throws error");
    
    t.end();
  });

  t.test("return value", function(t) {
    let spy = buildSpyOnce(true);

    t.equal(spy(), true, "returns specified value");
    
    t.end();
  });

  t.end();
});

test("mocks: buildSpy()", function(t) {
  t.test("buildSpy() spies on calls", function(t) {
    let spy = buildSpy();

    spy(1);
    spy();

    t.same(spy.calls, [[1], []]);
  
    t.end();
  });

  t.test("buildSpy() returns value", function(t) {
    let spy = buildSpy(1);

    t.equal(spy(), 1);
  
    t.end();
  });

  t.end();
});

test("buildStubOnce()", function(t) {
  t.test("returns value", function(t) {
    let stub = buildStubOnce("get", 1);

    t.equal(stub("get"), 1);
  
    t.end();
  });

  t.test("validates arguments", function(t) {
    let stub = buildStubOnce("get", 1);

    t.throws(() => stub("not_get"), /Arguments/);
  
    t.end();
  });

  t.test("stubs once", function(t) {
    let stub = buildStubOnce(2);

    stub();
    
    t.throws(() => stub(), /already called/);
  
    t.end();
  });

  t.end();
});