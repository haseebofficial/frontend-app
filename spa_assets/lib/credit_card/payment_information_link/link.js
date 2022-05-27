import React from "react";
import { show } from "credit_card/reducer/actions";

export default function PaymentInformationLink({dispatch, globals}) {
  let t = globals.i18n.scoped("credit_card.payment_information_link");
  return (
    <div className="payment-information">
      <span className="show-credit-card" testid="show-credit-card" onClick={() => dispatch(show())}>
        {t("text")}
      </span>
    </div>
  );
}