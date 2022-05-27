import * as local from "./local";

export { local };

export function interpretationCallPath(id) {
  return `/interpretation_calls/${id}`;
}

export function interpretationCallsPath() {
  return "/interpretation_calls";
}

export function interpretationCallExternalNumberPath(id) {
  return `/interpretation_calls/${id}/external_number`;
}

export function callSearchAvailableInterpretersPath(id) {
  return `/call_searches/${id}/available_interpreters`;
}

export function clientBalancePaymentsPath() {
  return "/client_balance_payments";
}

export function clientBalancePath() {
  return "/client_balance";
}