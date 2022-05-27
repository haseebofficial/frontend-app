import 'translation_order/_styles/order_summary.scss';
import React from "react";
import SummaryWrapper from "order_utils/order_summary";
import {t} from 'i18n';
import { AvatarCircle } from 'user/avatar';
import { format, parseISO } from 'date-fns'

export default function OrderSummary({children, data, interpreter}) {

  const utcFormat = (param) => {
    const date = new Date(param);
    const isoDate = date.toISOString();
    return `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)} UTC`;
  }

  return (
    <SummaryWrapper className="translation-order-summary">
      <div className="columns is-centered is-vcentered">
        <div className="column is-3">
          <div className="order-info-avatar">
            {/* <img src={data?.interpreter?.photo_url} alt={data?.interpreter?.name}/> */}
            <AvatarCircle src={interpreter?.photo_url} />
          </div>
        </div>
        <div className="column is-8">
          <ul className="order-list">
            <li>{t("global.translation_orders.interpreter_role")}: <span className="is-grey">{`${interpreter?.name}`}</span></li>
            <li>{t("global.order_page.selected_services")} <span className="is-grey"> Translation </span> </li>
            <li>{t("global.show_interpreter.confirm_modal.languages")} <span className="is-grey"> {data?.translation_request?.source_language} - {data?.translation_request?.target_language}</span> </li>
            {/* <li>{t("global.translation_orders.word_count")}  <a href="#" className="order-link">{t("global.translation_orders.view_file")}</a></li> */}
            <li>{t("global.translation_orders.word_count")} {data?.translation_request?.word_count === null ? <a href="#" className="section-link">{t("global.translation_orders.view_file")}</a> : data?.translation_request?.word_count}</li>
            <li>{t("global.translation_orders.specialisation")} <span className="is-grey">{data?.translation_request?.specialization}</span></li>
            <li>{t("global.translation_orders.due_date_time")} <span className="is-grey">{data?.translation_request?.due_date && utcFormat(data?.translation_request?.due_date)}</span></li>
          </ul>

          {children}
        </div>
      </div>
    </SummaryWrapper>
  );
}
