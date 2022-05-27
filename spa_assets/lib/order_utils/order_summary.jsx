import 'order_utils/_styles/order_summary.scss';
import React from "react";

export default function OrderSummary({children, className=""}) {
  return (
    <div className={`order-summary ${className}`}>
      {children}
    </div>
  );
}