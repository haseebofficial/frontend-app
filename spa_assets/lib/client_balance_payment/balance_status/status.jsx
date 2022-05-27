import React from "react";

export default function BalanceStatus({amount, refreshBalanceAmount, startBalancePayment, i18n}) {
  let t = i18n.scoped("client_balance_payment.balance_status.status");
  return (
    <div className="balance-status">
      <span className="amount">{t("amount_eur", {amount})}</span>
      <span className="refresh-amount" testid="refresh-amount" onClick={refreshBalanceAmount}></span>
      <br/>
      <span className="top-up-link" testid="top-up-link" onClick={startBalancePayment}>
        {i18n.t("client_balance_payment.top_up_text")}
      </span>
    </div>
  );
}