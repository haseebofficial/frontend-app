import test from "tape";

import { showPaymentPopup, updateBalanceAmount } from "client_balance_payment/reducer/actions";
import { buildSpyOnce } from "test/shared/mocks";

import Fetcher from "fetcher";
import { clientBalancePath } from "routes";
import { failTestOnReject } from "test/shared/promises";

import { buildRefreshBalanceAmount, buildStartBalancePayment } from "client_balance_payment/balance_status/commands";

test("client_balance_payment/balance_status/commands buildRefreshBalanceAmount", function(t) {
  let fetcher = new Fetcher();
  let dispatch = buildSpyOnce();

  let response = {body: {balance: {amount_eur: 15}}};
  fetcher.fetchApi.mockOnce({location: clientBalancePath(), response});

  function testDispatch() {
    t.same(dispatch.calledWith, [updateBalanceAmount(15)], "dispatches updateBalanceAmount action");
  }

  buildRefreshBalanceAmount({fetcher, dispatch})()
    .then(testDispatch, failTestOnReject(t))
    .finally(() => t.end());
});

// test("client_balance_payment/balance_status/commands buildStartBalancePayment", function(t) {
//   let dispatch = buildSpyOnce();
  
//   buildStartBalancePayment({dispatch})();

//   t.same(dispatch.calledWith, [showPaymentPopup()], "dispatches showPaymentPopup action");
  
//   t.end();
// });