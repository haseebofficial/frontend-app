const SHOW_PAYMENT_POPUP = "SHOW_PAYMENT_POPUP";
const HIDE_PAYMENT_POPUP = "HIDE_PAYMENT_POPUP";
const UPDATE_BALANCE_AMOUNT = "UPDATE_BALANCE_AMOUNT";

export let types = { SHOW_PAYMENT_POPUP, HIDE_PAYMENT_POPUP, UPDATE_BALANCE_AMOUNT };

export function showPaymentPopup(options) {
  let notEnoughFunds = !!(options && options.showNotEnoughFunds);
  return {type: SHOW_PAYMENT_POPUP, notEnoughFunds};
}

export function hidePaymentPopup() {
  return {type: HIDE_PAYMENT_POPUP};
}

export function updateBalanceAmount(amount) {
  return {type: UPDATE_BALANCE_AMOUNT, amount};
}