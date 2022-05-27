import React from "react";
import routes from "app/routes";
import i18n, {getAppLocale} from "i18n";
import { Link } from "react-router-dom";
import { useCurrentUser } from "login/login_state";

let pathName = window.location.pathname
let appLocale = getAppLocale()

export function SupportLink() {
  return (
    <a className="navbar-item" href={routes.supportPath()}>
      {i18n.t("layout.header.support")}
    </a>
  );
}

export function EditUserLink() {
  let currentUser = useCurrentUser();
  let parsedUser = {}
  if(currentUser) {
      try {
          parsedUser = JSON.parse(currentUser)
      } catch(e) {}
  }

  return (
    <a className="navbar-item" href={routes.editUserPath()}>
      <i className="fas fa-user is-hidden-desktop"/>
      {parsedUser?.name}
    </a>
  );
//   return (
//     <a className="navbar-item" target="_blank" href={`https://www.interpreters.travel/${appLocale}/users/edit`}>
//       <i className="fas fa-user is-hidden-desktop"/>
//       Дмитрий
//     </a>
//   );
}

export function AccountLink() {
  return (
    <React.Fragment>
      <a className="navbar-item is-hidden-touch" href={routes.personalAccountPath()}>
        {i18n.t("layout.header.personal_account")}
      </a>
      <a className="navbar-item is-hidden-desktop" href={routes.personalAccountPath()}>
        <i className="fas fa-shopping-cart"/>
        {i18n.t("layout.header.orders")}
      </a>
    </React.Fragment>
  );
}

export function OrdersLink() {
  return (
    <React.Fragment>
      {pathName !== `/${appLocale}/spa/orders`
        ? <a className="navbar-item" href={routes.spaOrdersPath()}>
            <i className="fas fa-search is-hidden-desktop"/>
            {i18n.t("layout.header.orders")}
        </a>
        : <></>
      }
    </React.Fragment>
  )
}

export function SearchesLink() {
  return (
    <React.Fragment>
      {pathName !== `/${appLocale}/spa/searches`
        ? <a className="navbar-item" href={routes.spaSearchesPath()}>
            <i className="fas fa-search is-hidden-desktop"/>
            {i18n.t("layout.header.searches")}
        </a>
        : <></>
      }
    </React.Fragment>
  );
}

export function CallsLink() {
  return (
    <React.Fragment>
      {pathName !== `/${appLocale}/spa/interpretation_calls`
        ? <a className="navbar-item" href={routes.spaInterpretationCallsPath()}>
            <i className="fas fa-phone-alt is-hidden-desktop"/>
            {i18n.t("layout.header.calls")}
          </a>
        : <></>
      }
    </React.Fragment>
  );
}

export function SigninLink() {
  return (
    <Link className="navbar-item" to={routes.loginPath()}>
      {i18n.t("layout.header.sign_in")}
    </Link>
  );
}