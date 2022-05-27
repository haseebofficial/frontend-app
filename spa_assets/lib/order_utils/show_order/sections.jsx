import 'order_utils/_styles/show_order/sections.scss';
import React from "react";

export default function ShowOrderSections({children, className=""}) {
  return (
    <div className={`show-order-sections ${className}`}>
      {children}
    </div>
  );
}