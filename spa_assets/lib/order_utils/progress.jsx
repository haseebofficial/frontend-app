import 'order_utils/_styles/progress.scss';
import React from "react";
import routes from "app/routes";
import { Link, useLocation } from "react-router-dom";
import {t} from 'i18n';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function OrderProgress({isCompleted=false, menuClicking=false}) {
  let query = useQuery();
  return (
    <ul className="order-progress">
      {
        menuClicking
        ? <>
          <li><i className="fas fa-check"></i><Link className="order-progress-link" to={routes.spaSearchPath({id: query.get("search_id")})}>{t("global.order_page.stage1")}</Link></li>
          <li><i className="fas fa-check"></i><Link className="order-progress-link" to={routes.spaSearchInterpreterPath({id: query.get("interpreter_id"), searchId: query.get("search_id")})}>{t("global.order_page.stage2")}</Link></li>
        </>
        : <>
          <li><i className="fas fa-check"></i>{t("global.order_page.stage1")}</li>
          <li><i className="fas fa-check"></i>{t("global.order_page.stage2")}</li>
        </>
      }
      <li className={isCompleted ? `` : 'is-active'}>
        {isCompleted ? <i className="fas fa-check"></i> : ''}
          {t("global.order_page.stage3")}</li>
    </ul>
  );
}
