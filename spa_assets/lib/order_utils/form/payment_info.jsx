import "order_utils/_styles/form/payment_info.scss";
import React, {useContext} from "react";
import { InputValueContext } from "order/new_order/new_order";
import { useHistory, useParams } from "react-router-dom";
import { InputValueTranslationContext } from "translation_order/new_translation_order/new_translation_order";
import {t} from 'i18n';

export default function PaymentInfo({isCashAvailable, isAvailableInvoice, isVisible=true, toggle, isScrollToFooter, onOrder}) {
  let url = useHistory()
  let pathname = url.location.pathname
  const {locale} = useParams()
  let { disabledButton, loginTab } = (pathname === "/" + locale + "/spa/orders/new") ? useContext(InputValueContext) : useContext(InputValueTranslationContext)
  
  return (
    
    <div className="order-payment-info">
      { !isVisible && 
        <>
          <span className="footer-description" dangerouslySetInnerHTML={{__html: t("global.order_page.personal_form.agreement_text").replace('%{policy}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/terms_conditions" target="_blank">'+t("global.order_page.personal_form.policy")+'</a>').replace('%{terms}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/privacy_policy" target="_blank"> '+t("global.order_page.personal_form.terms")+'</a>')}}></span>
          <button className="button is-interpreters-yellow" disabled={disabledButton || loginTab} onClick={onOrder}>{t("global.order_page.personal_form.submit")}</button>
          <div>
            <span className="footer-title">{t("global.order_page.payment.choice")}</span>
            <ul className="footer-list">
              {isAvailableInvoice &&                
                <li>- {t("global.order_page.payment.choice_invoice")}</li>
              }
              {isCashAvailable && 
                <li>- {t("global.order_page.payment.choice_cash")}</li>
              }
              <li>- {t("global.order_page.payment.choice_card")}</li>
            </ul>
            {/* {isCashAvailable &&
              <span>При выборе оплаты наличными условия отмены заказа согласовываются с переводчиком.</span>
          } */}
          </div>
        </>
      }
    </div>
  );
}