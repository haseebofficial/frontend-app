import { useState, useMemo } from "react";
import * as PairState from "./diametric_input_pair_state";

export function useDiametricInputPair() {
  let [pairState, setState] = useState(PairState.build(["", ""]));

  return [
    useInputState(pairState, setState, 0),
    useInputState(pairState, setState, 1)
  ];
}

function useInputState(pairState, setState, inputId) {
  let value = PairState.getValue(pairState, inputId);
  let dispatch = useMemo(() => {
    return action => setState(state => action(state, inputId));
  }, [setState, inputId]);

  return { value, dispatch };
}

export function setInitialValue(value) {
  return function(pairState, inputId) {
    return PairState.initValue(pairState, inputId, value);
  };
}

export function changeValue(value) {
  return function(pairState, inputId) {
    return PairState.setValue(pairState, inputId, value);
  };
}