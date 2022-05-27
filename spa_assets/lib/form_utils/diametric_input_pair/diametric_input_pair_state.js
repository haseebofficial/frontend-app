import * as CoreObject from "core_modules/core_object";

export function build([inputValue_0, inputValue_1]) {
  return {
    0: inputState(inputValue_0, false),
    1: inputState(inputValue_1, false)
  };
}

export function getValue(pairState, inputId) {
  return getInput(pairState, inputId).value;
}

export function initValue(pairState, inputId, value) {
  if (getInput(pairState, inputId).isInitialized) {
    return pairState;
  } else {
    return setValue(pairState, inputId, value);
  }
}

export function setValue(pairState, inputId, value) {
  let newState = maybeSwapInputValues(pairState, inputId, value);
  return CoreObject.put(newState, inputId, inputState(value));
}

function maybeSwapInputValues(pairState, inputId, newValue) {
  let otherInputId = getOtherInputId(inputId);
  let otherInputValue = getValue(pairState, otherInputId);

  if (otherInputValue === newValue) {
    let oldValue = getValue(pairState, inputId);
    return CoreObject.put(pairState, otherInputId, inputState(oldValue));
  } else {
    return pairState;
  }
}

function getInput(pairState, inputId) {
  return pairState[inputId];
}

function getOtherInputId(inputId) {
  return inputId === 0 ? 1 : 0;
}

function inputState(value, isInitialized=true) {
  return { value, isInitialized };
}