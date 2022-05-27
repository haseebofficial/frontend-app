import { assertArgsValid } from "test/shared/mocks/utils";

export { default as defmock } from "./defmock";

export function buildSpyOnce(returnValue) {
  function spyOnce() {
    if (spyOnce.isCalled) {
      throw new Error("spyOnce was already called");
    }
    spyOnce.isCalled =  true;
    spyOnce.calledWith = [...arguments];

    return returnValue;
  }

  spyOnce.isCalled = false;

  return spyOnce;
}

export function buildSpy(returnValue) {
  function spy() {
    spy.calls.push([...arguments]);

    return returnValue;
  }

  spy.calls = [];

  return spy;
}

export function buildStubOnce() {
  let args = [...arguments];
  let returnValue = args.pop();

  function stubOnce() {
    if (stubOnce._isCalled) {
      throw new Error("stubOnce was already called");
    } else {
      assertArgsValid(args, [...arguments], "stubOnce");
      stubOnce._isCalled = true;

      return returnValue;
    }

  }

  return stubOnce;
}