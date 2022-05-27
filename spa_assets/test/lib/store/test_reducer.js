export default { 
  testReducer: function(state, action) {
    state = state || null;

    if (action.type === "TEST_REDUCER_SET_STATE") {
      state = action.state;
    }
    
    return state;
  },

  _storeStateChanger: function(state, action) {
    state = state || null;

    if (action.type === "TEST_CHANGE_STORE_STATE") {
      state = {};
    }

    return state;
  } 
};

export function initalTestReducerState(state) {
  return { testReducer: state };
}

export function getTestReducerState(state) {
  return state.testReducer;
}

export function changeTestReducerState(state) {
  return { type: "TEST_REDUCER_SET_STATE", state };
}

export function changeStoreState() {
  return { type: "TEST_CHANGE_STORE_STATE" };
}