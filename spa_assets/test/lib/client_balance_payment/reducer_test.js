import test from "tape";

import reduce from "client_balance_payment/reducer";
import { showPaymentPopup, hidePaymentPopup, updateBalanceAmount } from "client_balance_payment/reducer/actions";

test("client_balance_payment/reducer", function(t) {
  t.test("default state", function(t) {
    t.same(reduce(undefined, {}), {displayPopup: false, amount: 0}, "returns displayPopup: false, amount: 0");

    t.end();
  });

  t.test("with unrecognized action", function(t) {
    let initialState = reduce(undefined, {});
    t.equal(reduce(initialState, {}), initialState, "returns same object");

    t.end();
  });

  t.test("showPaymentPopup action", function(t) {
    let action = showPaymentPopup();
    let newState = reduce(undefined, action);

    t.equal(newState.displayPopup, true, "sets displayPopup: true");
    t.equal(newState.notEnoughFunds, false, "sets showNotEnoughFunds: false");
    testAssignsOldStateToNewObject(t, action);
    
    t.end();
  });

  t.test("showPaymentPopup action with showNotEnoughFunds=true", function(t) {
    let action = showPaymentPopup({showNotEnoughFunds: true});
    let newState = reduce(undefined, action);

    t.equal(newState.notEnoughFunds, true, "sets notEnoughFunds: true");
    
    t.end();
  });

  t.test("hidePaymentPopup action", function(t) {
    let action = hidePaymentPopup();
    let newState = reduce(undefined, action);

    t.equal(newState.displayPopup, false, "sets displayPopup: true");
    testAssignsOldStateToNewObject(t, action);
    
    t.end();
  });

  t.test("updateBalanceAmount action", function(t) {
    let action = updateBalanceAmount(12);
    let newState = reduce(undefined, action);

    t.equal(newState.amount, 12, "sets amount");
    testAssignsOldStateToNewObject(t, action);
    
    t.end();
  });
});

function testAssignsOldStateToNewObject(t, action) {
  let oldState = {a: 1};
  let newState = reduce(oldState, action);

  t.equal(newState.a, 1, "preserves unrelated items from oldState");
  t.notEqual(oldState, newState, "returns new object");
}