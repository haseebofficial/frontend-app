import "layout/_styles/layout_service.scss";
import routes from "app/routes";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {t} from 'i18n';
import { $host } from "../http";

export default function LayoutService({currentService, citySelected=false, translatorSelected=false, city}) {
  if (currentService) {
    let activityClass = (service) => {
      return service === currentService ? "active" : "";
    };

    const [dashboard, setDashboard] = useState({country_count: 0, city_count: 0, interpreter_count: 0});

    const getDashboard = () => {
        $host('dashboards').then(res => {
            setDashboard(res.data)
        })
    }

    useEffect(() => {
        getDashboard()
    }, []);

    return (
      <div className="service">
        <div className="container">
          <ul className="service_list">
            <li>
              <Link
                to={routes.spaRootPath}
                className={`service_link ${activityClass("search")}`}>
                {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                  {
                    citySelected
                    ? <>
                      {
                        translatorSelected
                        ? <>{t("layout.tabs.interpreter_in")} <br className="is-hidden-desktop"/> {city ? city : "..."}</>
                        : <>{t("layout.tabs.interpreters_in")} <br className="is-hidden-desktop"/> {city ? city : "..."}</>
                      }
                    </>
                    : <>{t("layout.tabs.interpreters_in")} <br className="is-hidden-desktop"/> {t("layout.tabs.countries").replace("%{country_count}", dashboard?.country_count)}</>
                  }
                 {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
              </Link>
            </li>
            <li>
              <Link
                to={routes.spaPhonePath}
                className={`service_link ${activityClass("phone")}`}>
                  {
                    citySelected ?
                      <>
                        <span className="is-hidden-desktop" dangerouslySetInnerHTML={{__html: t("layout.tabs.international_calls_with_interpreters.mobile_city_selected").replace("%{city}", city)}}></span>
                        <span className="is-hidden-touch">{t("layout.tabs.international_calls_with_interpreters.desktop_city_selected").replace("%{city}", city)}</span>
                      </>
                    :
                      <>
                        <span className="is-hidden-desktop" dangerouslySetInnerHTML={{__html: t("layout.tabs.international_calls_with_interpreters.mobile")}}></span>
                        <span className="is-hidden-touch">{t("layout.tabs.international_calls_with_interpreters.desktop")}</span>
                      </>
                  }
              </Link>
            </li>
            <li>
              <Link
                to={routes.textTranslationsPath()}
                className={`service_link ${activityClass("textTranslation")}`}>
                <span className="is-hidden-desktop" dangerouslySetInnerHTML={{__html: t("layout.tabs.texts_docs_translations.mobile")}}></span>
                <span className="is-hidden-touch">{t("layout.tabs.texts_docs_translations.desktop")}</span>

              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }

}