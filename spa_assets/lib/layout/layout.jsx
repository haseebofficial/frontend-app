import "layout/_styles/layout.scss";
import "layout/_styles/layout_footer.scss";

import React from "react";
import routes from "app/routes";
import { t } from "i18n";
import LayoutNavbar from "layout/navbar";
import LayoutHelmet from "layout/layout_helmet";

export default function Layout(props) {
  return (
    <section className="hero is-fullheight" testid="layout">
      <LayoutHelmet/>
      <LayoutNavbar linearLayout={props.linearLayout}/>
      {props.children}
      <div className="hero-footer">
        <nav className="layout-footer">
          <div className="container">
            <div className="footer-menu">
              <a className="footer-item" href={routes.aboutPath()}>
                {t("layout.footer.about")}
              </a>
              <a className="footer-item is-hidden-touch" href={routes.supportPath()}>
                {t("layout.footer.support")}
              </a>
              <a className="footer-item" href={routes.forInterpretersPath()}>
                {t("layout.footer.for_interpreters")}
              </a>
              <a className="footer-item" href={routes.forAffiliatesPath()}>
                {t("layout.footer.for_affiliates")}
              </a>
              <a className="footer-item" href={routes.termsPath()}>
                {t("layout.footer.terms")}
              </a>
              <a className="footer-item" href={routes.privacyPolicyPath()}>
                {t("layout.footer.privacy_policy")}
              </a>
            </div>
            <div className="footer-bottom">
              <span className="footer-copyright">
                © Copyright 2019. interpreters.travel. All rights reserved.
              </span>
              <span className="footer-social-media">
                {/*<a href="facebook" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-square"></i></a>*/}
                <a href="https://www.facebook.com/interpreters.travel/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-square"></i></a>
                <a href="https://www.linkedin.com/company/interpreters-travel/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                <a href="https://www.youtube.com/channel/UCHdC6jw6SHFbuRXhOjSpLDw" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
              </span>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}