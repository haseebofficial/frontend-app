import React from "react";
import routes from "app/routes";
import { Switch, Route, Link } from "react-router-dom";
import {t} from 'i18n';

export default function PreviousPageLink({previousPageData}) {
  return (
    <Switch>
      <Route exact path={routes.spaSearchInterpreterPath.raw}><ToSearchPage previousPageData={previousPageData}/></Route>
    </Switch>
  );
}

function ToSearchPage({previousPageData}) {
  let searchId = previousPageData?.id
  return <BaseLink to={routes.spaSearchPath({id: searchId ? searchId : 0})}>{t("global.show_interpreter.back_link").replace('%{city}', previousPageData?.city)}</BaseLink>;
}

function BaseLink({children, to}) {
  return (
    <Link to={to} className="navbar-item previous-link">
      <i className="fas fa-caret-left"></i>
      {children}
    </Link>
  );
}