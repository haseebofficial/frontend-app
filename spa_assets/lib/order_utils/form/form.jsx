import "order_utils/_styles/form/form.scss";
import React from "react";

export { default as ClientInfoFields } from "./client_info_fields";
export { default as PaymentInfo } from "./payment_info";

export default function OrderForm({children}) {
  return (
    <form className="order-form">
      {children}
    </form>
  );
}