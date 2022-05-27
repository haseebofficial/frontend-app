export function initialState(value) {
  return { isLoaded: false, isLoading: false, value };
}

export function loadingState(value) {
  return { isLoaded: false, isLoading: true, value };
}

export function loadedState(value) {
  return { isLoaded: true, isLoading: false, value };
}

export function ensureStateLoaded(describedState, loadValue) {
  return function(dispatch, getState) {
    let state = getState()[describedState.name];

    if (state.isLoaded || state.isLoading) {
      return;
    } else {
      let overwriteState = s => dispatch(describedState.newAction(() => s));

      overwriteState(loadingState(state.value));
      loadValue().then(value => overwriteState(loadedState(value)));
    }
  };
}