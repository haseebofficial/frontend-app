import React from "react";
import useVisible from "react_utils/use_visible";
import { availableLocales } from "i18n/locales";
import { useCurrentPagePath } from "app_page/app_page_route";
import { t, getAppLocale } from "i18n";

export default function LanguagesDropdown() {
  let { isVisible, show, hide, toggle } = useVisible();
  let appLocale = getAppLocale();
  let allLocales = availableLocales.filter(i => i !== appLocale);

  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div  className="is-hidden-desktop">
        <div className={`navbar-item has-dropdown ${activityClass}`} {...events}>
          <div className="navbar-link">
            {t(`global.locales.${appLocale}`)}
          </div>
          <div className="navbar-dropdown languages-dropdown">
            {allLocales.map((l, i) => <LanguageLink locale={l} key={i}/>)}
          </div>
        </div>
      </div>
      <div className="is-hidden-touch">
        <div className="">
          {allLocales.map((l, i) => <LanguageLink locale={l} key={i}/>)}
        </div>
      </div>
    </React.Fragment>
    
  );
}

function LanguageLink({locale}) {
  let href = useCurrentPagePath({locale});

  return (
    <a className="navbar-item" testid={`change-locale-${locale}`} href={href}>
      {t(`global.locales.${locale}`)}
    </a>
  );
}