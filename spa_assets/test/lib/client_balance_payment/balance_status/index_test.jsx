import test from "tape";
import { React, toInstance, GlobalsStubProvider, findByTestId } from "test/shared/react";
import buildStore from "store";

import BalanceStatusWrapper from "client_balance_payment/balance_status";
import BalanceStatus from "client_balance_payment/balance_status/status";

test("balance_status/index", function(t) {
  t.test("BalanceStatus props", function(t) {
    let store = buildStore({clientBalance: {amount: 13}});
    let {props } = instanceWithStore({store}).findByType(BalanceStatus);

    t.equal(props.amount, 13, "includes amount");
    t.notEqual(props.i18n, undefined, "includes i18n");
    t.notEqual(props.refreshBalanceAmount, undefined, "includes refreshBalanceAmount command");
    t.notEqual(props.startBalancePayment, undefined, "includes startBalancePayment command");

    findByTestId(instanceWithStore({store}),  "top-up-link").props.onClick();

    t.end();
  });
  
  t.end();
});

function instanceWithStore({store}) {
  return toInstance( 
    <GlobalsStubProvider store={store}>
      <BalanceStatusWrapper/>
    </GlobalsStubProvider>
  );
}