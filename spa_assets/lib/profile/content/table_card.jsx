import React, {useState} from "react";
import 'profile/_styles/content/table_card.scss';
import ModalWindow from 'modal_window/modal_window';
import SearchFilter from "../../search/search_page/filter/filter";
import {t} from 'i18n';

export default function TableCard({service, search, createOrder, changeDateAndTime, locale}) {
    let [freeCancellationWindow, setFreeCancellationWindow] = useState(false)
    let [toOrder, setToOrder] = useState(false)
    function changeDate() {
        setToOrder(false)
        setTimeout(changeDateAndTime,300)
    }
    return (
      <React.Fragment>
        <tr className="table-row">
          <td>
            <a className="is-family-regular table-service" href={`https://www.interpreters.travel/${locale}/help/services/${service?.service_type.service_name}`} target="_blank">{service?.service_type.name}</a> <br/>
            { service?.cancellation &&
              <span className="table-cancellation" onClick={() => setFreeCancellationWindow(true)}>{t("global.show_interpreter.free_cancellation")}  </span>
            }
            {service?.discount && <span> | {t("global.show_interpreter.discount")} {service.discount} %</span>}
          </td>
          <td className="table-price">{service?.calculated_price} EUR</td>
          <td>
            <button className="table-btn button is-interpreters-yellow" onClick={() => setToOrder(true)}>{t("global.show_interpreter.order_button")}</button>
          </td>
        </tr>
        <ModalWindow modalTitle={t("search_form.js.titles.confirm_order_date")} active={toOrder} setActive={setToOrder} buttonOk={false} >
          <div className="modal-content-body-wrapper">
            <div className="modal-content-body">
                <div className="data-order">
                    <div className="data-order-item data-order-date">
                        {t("global.show_interpreter.confirm_modal.date")} <span>{search?.intervals_text}</span>
                    </div>
                    <div className="data-order-item data-order-service">
                      {service?.service_type.name}
                    </div>
                    <div className="data-order-item data-order-languages">
                        {t("global.show_interpreter.confirm_modal.languages")} <br className="is-hidden-desktop"/><span>{search.language.name} - {search.your_language.name}</span>
                    </div>
                    <div className="data-order-item data-order-price">
                        {t("global.show_interpreter.confirm_modal.price")} <span>{service?.calculated_price} EUR</span>
                    </div>
                </div>
            </div>
          </div>
                      
          <div className="modal-content-footer">
              <div className="table-buttons is-hidden-touch">
                <button className="button button-one is-interpreters-yellow" onClick={changeDate}>{t("search_form.js.buttons.change_order_date")}</button>
                <button className="button button-two is-interpreters-yellow" onClick={createOrder}>{t("search_form.js.buttons.confirm_order_date")}</button>
              </div>
              <div className="is-hidden-desktop">
                <button className="button is-interpreters-yellow is-fullwidth" onClick={changeDate}>{t("search_form.js.buttons.change_order_date")}</button>
                <button className="button is-interpreters-yellow is-fullwidth" onClick={createOrder}>{t("search_form.js.buttons.confirm_order_date")}</button>
              </div>
          </div>
        </ModalWindow>
        <ModalWindow active={freeCancellationWindow} setActive={setFreeCancellationWindow}>
            {/* Возможна бесплатная отмена заказа не позднее, чем до {service?.cancellation} часов до начала встречи. 
            Отмена заказа позднее этого срока и до начала встречи, возможна только с удержанием оплаты 
            первых двух часов услуг переводчика. */}
            {t("global.show_interpreter.free_cancellation_text").replace('%{hours}', service?.cancellation)}
        </ModalWindow>
      </React.Fragment>
    )
}
