import React from "react";
import routes from "app/routes";
import { Switch, Route } from "react-router-dom";
import useVisible from "react_utils/use_visible";

let displayDropdownAt = [
  routes.spaSearchPath.raw,
  routes.spaSearchInterpreterPath.raw
];

export default function MaybeCurrenciesDropdown() {
  return (
    <Switch>
      {displayDropdownAt.map((path, i) => 
        <Route exact path={path} key={i}><CurrenciesDropdown/></Route>
      )}
    </Switch>
  );
}

function CurrenciesDropdown() {
  let { isVisible, show, hide, toggle } = useVisible();

  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div className="is-hidden-desktop">
        <div className={`navbar-item has-dropdown ${activityClass}`} {...events}>
          <div className="navbar-link">
            USD
          </div>
          <div className="navbar-dropdown">
            {["EUR", "RUB"].map((c, i) => <CurrencyLink currency={c} key={i}/>)}
          </div>
        </div>
      </div>
      <div className="is-hidden-touch">
        <div className="navbar-dropdown-currencies">
          {["EUR", "RUB"].map((c, i) => <CurrencyLink currency={c} key={i}/>)}
        </div>
      </div>
    </React.Fragment>
  );
}

function CurrencyLink({currency}) {
  return (
    <a className="navbar-item">
      {currency}
    </a>
  );
}