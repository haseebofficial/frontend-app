import { combineReducers, createStore } from 'redux';

import callSearches from "call_search/reducer";
import twilioReducer  from "twilio/reducer";
import clientBalance from "client_balance_payment/reducer";
import creditCard from "credit_card/reducer";
import notificationsReducer from "notifications/reducer";
import supportCallModal from "support_call/support_call_modal_reducer";

let reducers = { 
  callSearches, 
  clientBalance, 
  creditCard,
  supportCallModal
};

reducers = addReducer(reducers, notificationsReducer);
reducers = addReducer(reducers, twilioReducer);

if (process.env.NODE_ENV === "test") {
  let testReducer = require("test/lib/store/test_reducer").default;

  reducers = addReducer(reducers, testReducer);
}

function addReducer(reducers, newReducer) {
  return Object.assign({}, reducers, newReducer);
}

export default function buildStore(preloadedState) { 
  return createStore(combineReducers(reducers), preloadedState); 
}

export function subscribe(store, reducerName, callback) {
  let prevState = store.getState()[reducerName];

  callback(prevState);

  store.subscribe(() => {
    let state = store.getState();
    let reducerState = state[reducerName];

    if (reducerState !== prevState) {
      prevState = reducerState;
      callback(reducerState);
    }
  });
}