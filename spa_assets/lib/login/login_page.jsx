import "login/_styles/login_page.scss";
import React from "react";
import { t } from "i18n";
import { Redirect } from "react-router";
import { useCurrentUser } from "login/login_state";
import LayoutBody from "layout/layout_body";
import routes, { backendUrl } from "app/routes";
import LoginForm from "./login_form";

export default function MaybeLoginPage() {
  let currentUser = useCurrentUser();

  if (currentUser) {
    return <Redirect to={routes.textTranslationsPath()}/>;
  } else {
    return <LoginPage/>;
  }
}

function LoginPage() {
  return(
    <LayoutBody slogan={t("login_page.page_slogan")}>
      <div className="columns" testid="login-page">
        <div className="column is-one-third">
          <div className="login-box">
            <LoginForm/>
            <a className="interpreters-login-link" href={backendUrl}>{t("login_page.links.sign_in_for_interpreters")}</a>
            <div className="session-links">
              <div className="signup-links">
                <a href={routes.signUpPath()}>{t("login_page.links.sign_up")}</a>
                <span className="links-divider"> / </span>
                <a href={routes.signUpInterpreterPath()}>{t("login_page.links.sign_up_for_interpreters")}</a>
              </div>
              <a href={routes.restorePasswordPath()}>{t("login_page.links.restore_password")}</a>
            </div>
          </div>
        </div>
      </div>
    </LayoutBody>
  );
}