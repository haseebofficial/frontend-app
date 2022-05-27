import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { combineStates } from "redux-describe-state";
import { RESET_STORE_ACTION } from "./reset_store_state";
import STATES from "./states";
import callSearches from "../call_search/reducer";
import {twilioCall, twilioCallRequest}  from "../twilio/reducer";

let _reducers = { 
  callSearches, 
  twilioCall,
  twilioCallRequest
};

export function buildStore(states=STATES) {
  return createStore(createRootReducer(states), applyMiddleware(thunk));
}

function createRootReducer(states) {
  let _combineStates = combineStates(states);
  let _combineReducers= Object.assign({}, _reducers, _combineStates);
  let rootReducer = combineReducers(_combineReducers);

  return function(state, action) {
    if (action.type === RESET_STORE_ACTION) {
      state = undefined;
    }

    return rootReducer(state, action);
  };
}