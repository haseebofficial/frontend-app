import test from "test/browser_tape";
import { renderHook, act } from '@testing-library/react-hooks';
import { useDiametricInputPair, setInitialValue, changeValue } from "form_utils/diametric_input_pair";

test("useDiametricInputPair", function(t) {
  function getInputs(pair) {
    return pair.result.current;
  }

  function getFirstInput(pair) {
    return getInputs(pair)[0];
  }

  function getSecondInput(pair) {
    return getInputs(pair)[1];
  }

  function dispatchTo(input, action) {
    return act(() => input.dispatch(action));
  }

  t.test("base properties", function(t) {
    t.test("sets {value: '', dispatch: fun} for both inputs", function(t) {
      let pair = renderHook(() => useDiametricInputPair());
      let [input_1, input_2] = getInputs(pair);

      t.equal(input_1.value, "");
      t.equal(input_2.value, "");
      t.equal(typeof input_1.dispatch, "function");
      t.equal(typeof input_2.dispatch, "function");
  
      t.end();
    });

    t.test("preserves dispatch's identity between changes", function(t) {
      let pair = renderHook(() => useDiametricInputPair());

      let oldDispatch = getFirstInput(pair).dispatch;
      dispatchTo(getFirstInput(pair), setInitialValue("foo"));
      let newDispatch = getFirstInput(pair).dispatch;

      t.equal(oldDispatch, newDispatch);
    
      t.end();
    });
  });

  t.test("dispatch: setInitialValue", function(t) {
    t.test("initializes input's value", function(t) {
      let pair = renderHook(() => useDiametricInputPair());

      dispatchTo(getFirstInput(pair), setInitialValue("foo"));
      dispatchTo(getSecondInput(pair), setInitialValue("bar"));

      t.equal(getFirstInput(pair).value, "foo");
      t.equal(getSecondInput(pair).value, "bar");
    
      t.end();
    });

    t.test("does nothing if value was already initialized", function(t) {
      let pair = renderHook(() => useDiametricInputPair());

      dispatchTo(getFirstInput(pair), setInitialValue("foo"));
      dispatchTo(getFirstInput(pair), setInitialValue("bar"));

      t.equal(getFirstInput(pair).value, "foo");
    
      t.end();
    });
  });

  t.test("dispatch: changeValue", function(t) {
    t.test("changes input's value", function(t) {
      let pair = renderHook(() => useDiametricInputPair());

      dispatchTo(getFirstInput(pair), changeValue("foo"));
      t.equal(getFirstInput(pair).value, "foo");
  
      t.end();
    });

    t.test("is able to overwrite initial value", function(t) {
      let pair = renderHook(() => useDiametricInputPair());

      dispatchTo(getFirstInput(pair), setInitialValue("foo"));
      dispatchTo(getFirstInput(pair), changeValue("bar"));

      t.equal(getFirstInput(pair).value, "bar");
  
      t.end();
    });
  });
});