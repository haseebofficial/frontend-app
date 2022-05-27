import "client_utils/_styles/tabs.scss";
import React from "react";

export default function ClientTabs({children}) {
  return (
    <ul className="client-tabs">
      {children}
    </ul>
  );
}
