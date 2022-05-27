import { clientBalancePath } from "routes";
import { updateBalanceAmount, showPaymentPopup } from "client_balance_payment/reducer/actions";
import { show } from "credit_card/reducer/actions";

export function buildRefreshBalanceAmount({fetcher, dispatch}) {
  return function() {
    return fetcher.fetchApi(clientBalancePath())
      .then(({json}) => dispatch(updateBalanceAmount(json.balance.amount_eur)));
  };
}

export function buildStartBalancePayment({dispatch}) {
  return function() {
    dispatch(show());
  };
}