import React from "react";

import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';

import BalanceStatus  from "./status";
import { buildRefreshBalanceAmount, buildStartBalancePayment } from "client_balance_payment/balance_status/commands";

function mapStateToProps(state) {
  return {amount: state.clientBalance.amount};
}

const BalanceStatusWrapper = connect(
  mapStateToProps
)(
  globalsToProps(BalanceStatusPropsDelegator)
);

export default BalanceStatusWrapper;

function BalanceStatusPropsDelegator({globals, dispatch, amount}) {
  let { i18n,  fetcher } = globals;

  let refreshBalanceAmount = buildRefreshBalanceAmount({fetcher, dispatch});
  let startBalancePayment = buildStartBalancePayment({dispatch});

  return <BalanceStatus {...{amount, i18n, refreshBalanceAmount, startBalancePayment}}/>;
}