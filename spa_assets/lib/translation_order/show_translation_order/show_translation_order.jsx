import "translation_order/_styles/show_translation_order/show_translation_order.scss";
import React, { useRef, useState, useEffect } from "react";
import useVisible from "react_utils/use_visible";
import LayoutBody from "layout/layout_body";
import InterpreterProfileSidebar from "user/interpreter/profile_sidebar";
import OrderSections from "order_utils/show_order/sections";
import PageNavbar from "order_utils/page_navbar";
import ReviewForm from "client_reviews/new_review_form";
import ScrollLink from "react_utils/scroll_link";
import {t} from 'i18n';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { $host } from '../../http';

export let ShowTranslationOrderPageContext = React.createContext()

export default function ShowTranslationOrderPage() {
  let [isLoading, setIsLoading] = useState()
  let [interpreter, setInterpreter] = useState()
  let [search, setSearch] = useState()
  let [orderData, setOrderData] = useState()
  let [data, setData] = useState()
  let params = useLocation()
  let [token, setToken] = useState(params?.state?.signin_token)
  const {id, locale} = useParams()
  const history = useHistory();
  
  const getData = async () => {
    setIsLoading(true)
    try {
      let res = await $host(`translation_orders/${id}?locale=${locale}${token ? '&signin_token=' + token : '' }`).then(res => res.data)
      setData(res)
      setOrderData(res.order)
      setInterpreter(res.order.interpreter)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <ShowTranslationOrderPageContext.Provider value={{
    interpreter, isLoading, orderData, token
    }}>
      <LayoutBody>
        <div className="show-translation-order-page">
          <PageNavbar>
            <li>
                <a className="order-nav-link active" href="#">{t("global.show_interpreter.order")} {orderData?.id}</a>
            </li>
            <li>
                <a className="order-nav-link" href="#">{t("global.order_pages_sidebar.orders")}</a>
            </li>
          </PageNavbar>

          <div className="columns">
            <OrderSections className="column is-hidden-desktop">
                <OrderInfoSection className="mobile-order-info" data={data}/>
            </OrderSections>

            <div className="column is-4">
                <InterpreterProfileSidebar preliminaryRequest={false}>
                <div className="profile-section is-hidden-desktop">
                    <ReviewFormSection/>
                </div>
                </InterpreterProfileSidebar>
            </div>

            <div className="column">
              <OrderSections>
              <div className="is-hidden-touch">
                  <ReviewFormSection/>
              </div>

              <OrderInfoSection className="is-hidden-touch" data={data}/>
                <div className="section-info is-mobile-border-none">
                  <span className="title">{t("global.show_order_page.contact_details")}</span>
                  <ul className="section-list">
                    <li> {t("global.show_order_page.email")} <span className="is-grey">{t("global.show_order_page.details_not_available")}</span></li>
                    <li> {t("global.show_order_page.phone")} <span className="is-grey">{t("global.show_order_page.details_not_available")}</span></li>
                  </ul>

                  <div className="is-mobile-section">
                    <span className="title">{t("global.show_order_page.payment_info")}</span>
                    <ul className="section-list">
                      <li>{t("global.show_order_page.payment")} <span className="is-grey">{data?.order?.payment?.provider}</span></li>
                    </ul>
                    <button className="button">{t("global.show_order_page.get_receipt")}</button>
                    <span className="title">{t("global.show_order_page.client_info.title")}</span>
                    <ul className="section-list">
                        <li>{t("global.show_order_page.client_info.name")} <span className="is-grey">{data?.order?.client?.name}</span></li>
                        <li>{t("global.show_order_page.phone")} <span className="is-grey">{data?.order?.client?.phone}</span></li>
                        <li>{t("global.order_page.personal_form.email")} <span className="is-grey">{data?.order?.client?.email}</span></li>
                    </ul>
                  </div>
                </div>
              </OrderSections>
            </div>
          </div>
        </div>
      </LayoutBody>
    </ShowTranslationOrderPageContext.Provider>
  );
}

function ReviewFormSection() {
  let form = useVisible();
  const buttonRef = useRef()

  const openingAndScroll = () => {
    form.toggle()
  }

  return (
    <div className="section-info">
      <ScrollLink to="reviewFormTranslation">
        <button ref={buttonRef} className="is-yellow-button" onClick={openingAndScroll}>{t("global.client_reviews.leave_review")}</button>
      </ScrollLink>
      <div name="reviewFormTranslation">
        {form.isVisible && <ReviewForm/>}
      </div>
    </div>
  );
}

function OrderInfoSection({className="", data}) {

  const utcFormat = (param) => {
    const date = new Date(param);
    const isoDate = date.toISOString();
    return `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)} UTC`;
  }

  return (
    <div className={`section-info is-mobile-border-none ${className}`}>
      <ul className="section-list">
        <li>{t("global.order_page.selected_services")} <span className="is-grey">Translation</span></li>
        <li>{t("global.order_page.language_pairs")} <span className="is-grey">{data?.translation_request?.source_language} - {data?.translation_request?.target_language}</span></li>
        <li>{t("global.translation_orders.word_count")} {data?.translation_request?.word_count === null ? <a href="#" className="section-link">{t("global.translation_orders.view_file")}</a> : data?.translation_request?.word_count}</li>
        <li>{t("global.translation_orders.specialisation")} <span className="is-grey">{data?.translation_request?.specialization}</span></li>
        <li>{t("global.searches_index_page.intervals")}: <span className="is-grey">{data?.translation_request?.due_date && utcFormat(data?.translation_request?.due_date)}</span></li>
        <li>{t("global.order_page.order_price")} <span className="is-grey">340 {data?.order?.currency}</span></li>
      </ul>
    </div>
  );
}
