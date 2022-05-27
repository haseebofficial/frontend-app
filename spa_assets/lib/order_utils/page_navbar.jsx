import "order_utils/_styles/page_navbar.scss";
import React from "react";

export default function OrderPageNavbar({children}) {
  return (
    <div className="order-page-navbar">
      <ul className="nav-list">
        {children}
      </ul>
    </div>
  );
}