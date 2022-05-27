import 'order_utils/_styles/tabs.scss';
import React from "react";

export default function OrderTabs({children, isMobileFull=false}) {
  let className = isMobileFull ? "mobile-full" : "";

  return (
    <ul className={`order-tabs ${className}`}>
      {children}
    </ul>
  );
}