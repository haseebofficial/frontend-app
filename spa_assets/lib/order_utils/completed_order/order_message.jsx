import 'order_utils/_styles/completed_order/order_message.scss';
import { HasRedirection, useRedirection } from "react_utils/redirection";
import React from "react";
import {t} from 'i18n';

export default function OrderMessage({orderPath, orderData, client}) {
  let orderRedirection = useRedirection();

  return (
    <div className="order-message">
      <HasRedirection redirection={orderRedirection}/>
      <span className="message-title">{t("global.order_complete.for_client").replace("%{client}", client?.full_name)} <br/> {t("global.order_complete.order_registered")}
      </span>
      {/* <span className="message-description">На указанный адрес электронной почты выслано подробное описание заказа, <br/> а также описание дальнейших действий.</span> */}
      <span className="message-description" dangerouslySetInnerHTML={{__html: t("global.order_complete.text")}}></span>
      <a className="message-button button is-interpreters-yellow" onClick={() => orderRedirection.redirectTo({pathname: orderPath, state: orderData})}>{t("global.order_complete.link")}</a>
    </div>
  );
}
