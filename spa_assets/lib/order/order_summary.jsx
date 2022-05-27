import 'order/_styles/order_summary.scss';
import React from "react";
import SummaryWrapper from "order_utils/order_summary";
import { AvatarCircle } from 'user/avatar';
import { Link, useLocation } from "react-router-dom";
import routes from "app/routes";
import {t} from 'i18n';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function OrderSummary({children, interpreter, search, service, canChangeDate=false, isVisible}) {
  let query = useQuery();
  return (
    <SummaryWrapper className="interpretation-order-summary">
      <div className="columns is-centered">
        <div className="column is-3">
          <div className="order-info-avatar">
            <AvatarCircle src={interpreter?.photo_url} />
          </div>
        </div>
        <div className="column is-8">
          <span className="order-title">{interpreter?.name}</span>
          <span className="order-description is-grey">{t("global.interpreter.title")}</span>
          <ul className="order-list">
            <li>{t("global.order_page.services_info").replace("%{city}.", '')}<span className="is-grey">{search?.city?.name} - {search?.city?.country?.name}.</span></li>
            <li>{t("global.order_page.selected_period")} <span className="is-grey">{search?.intervals_text}</span>
              {" "}
                {!isVisible && canChangeDate &&
                  <Link to={routes.spaSearchPath({id: query.get("search_id")}) + '?changeDateTime=true'} className="order-link">{t("global.search_page.change_date")}</Link>
                }
            </li>
            <li>{t("global.order_page.language_pairs")} <span className="is-grey">{search?.language?.name} - {search?.your_language?.name} | {search?.your_language?.name} - {search?.language?.name}</span></li>
            <li>{t("global.order_page.selected_services")} <span className="is-grey">{service?.service_type?.name}</span></li>
            <li>{t("global.order_page.order_cancellation")} <span className="is-grey">{t("global.order_page.cancellation_possible").replace('%{date}', service?.cancellation)}</span></li>
          </ul>

          {children}
        </div>
      </div>
    </SummaryWrapper>
  );
}
