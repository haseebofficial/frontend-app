import "order/_styles/show_order/show_order.scss";
import React, { useState,useRef, useEffect, useContext } from "react";
import useVisible from "react_utils/use_visible";
import LayoutBody from "layout/layout_body";
import InterpreterProfileSidebar from "user/interpreter/profile_sidebar";
import OrderSections from "order_utils/show_order/sections";
import PageNavbar from "order_utils/page_navbar";
import ReviewForm from "client_reviews/new_review_form";
import ScrollLink from "react_utils/scroll_link";
import ModalWindow from "modal_window/modal_window"
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { $host, $hostOld } from '../../http';
import { useRedirection } from "react_utils/redirection";
import routes from "app/routes";
import {t} from 'i18n';
import PaymentForm from "payment/payment_form";
import { useScrollScreenBottom } from 'react_utils/scroll_link';

export let ShowOrderPageContext = React.createContext()

export default function ShowOrderPage() {
  let [paymentReceipt, setPaymentReceipt] = useState(false)
  let [orderVoucher, setOrderVoucher] = useState(false)
  let [confirmCancelOrder, setConfirmCancelOrder] = useState(false)
  
  let [isLoading, setIsLoading] = useState()
  let [interpreter, setInterpreter] = useState()
  let [search, setSearch] = useState()
  let [orderData, setOrderData] = useState()
  let params = useLocation()
  let [token, setToken] = useState(params?.state?.signin_token)
  const {id, locale} = useParams()
  const history = useHistory();
  let [service, setService] = useState({});
  const [paymentType, setPaymentType] = useState({});
  
  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`orders/${id}?locale=${locale}${token ? '&signin_token=' + token : '' }`).then(res => res.data)
    //   console.log(data)
      setOrderData(data.order)
      setInterpreter(data.order.interpreter)
      setSearch(data.order.search)
      setService(data.order.service)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    console.log(params)
    getData()
  }, [])

  const handleCancelOrder = () => {
    $host.delete(`orders/${id}${token ? '?signin_token=' + token : '' }`).then(res => {
      setConfirmCancelOrder(false);
      history.goBack()
      }).catch(function (error) {
        // if (error.response) {
        //   console.log(error.response)
        // }
    });
  }

  const handlePaymentReceipt = () => {
    // alert('handle payment receipt');
    $host(`orders/${id}/receipt${token ? '?signin_token=' + token : '' }`, {
      responseType: 'blob'
    }).then(res => {
      if (res.status === 200) {
        if (orderData?.state !== 'completed' && orderData?.payment?.provider === 'cash') {
          setPaymentReceipt(true)
        } else {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'receipt.pdf'); //or any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      } else {
        setPaymentReceipt(true)
      }
    }).catch(function (error) {
      setPaymentReceipt(true)
    });
  }

  const handleOrderVoucher = () => {
    $host(`orders/${id}/voucher${token ? '?signin_token=' + token : '' }`, {
      responseType: 'blob'
    }).then(res => {
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'voucher.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setOrderVoucher(true)
      }
    }).catch(function (error) {
      setOrderVoucher(true)
    });
  }

  const handleDownloadInvoice = () => {
    $host(`orders/${id}/invoice${token ? '?signin_token=' + token : '' }`, {
      responseType: 'blob'
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response)
      }
    });
  }

  const handleReviewOrder = (request) => {
    // console.log(request)
    $host.post(`orders/${id}/review${token ? '?signin_token=' + token : '' }`, request)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          history.push(routes.spaOrdersPath())
        } else {
          alert('Review already exists for this order')
        }
      })
      .catch(function (error) {
        alert('Review already exists for this order')
        // if (error.response) {
        //   console.log(error.response)
        // }
    });
  }

  const utcFormat = (param) => {
    const date = new Date(param);
    const isoDate = date.toISOString();
    return `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)} UTC`;
  }

  return (
    <>
    {!isLoading &&
      <ShowOrderPageContext.Provider value={{
        interpreter, search, isLoading, orderData, token, service, paymentType, setPaymentType
      }}>
          <LayoutBody>
          <div className="show-order-page">
              <PageNavbar>
              <li>
                  <a className="order-nav-link active" href="#">{t("global.show_interpreter.order")} {orderData?.id}</a>
              </li>
              <li>
                  <a className="order-nav-link" href={routes.spaOrdersPath()}>{t("global.order_pages_sidebar.orders")}</a>
              </li>
              </PageNavbar>

              <div className="columns">
              <OrderSections className="column is-hidden-desktop">
                  <OrderInfoSection className="mobile-order-info"/>
              </OrderSections>

              <div className="column is-4">
                  <InterpreterProfileSidebar preliminaryRequest={false}>
                  <div className="profile-section is-hidden-desktop">
                      {
                        ['awaiting_certificate_confirmation', 'awaiting_commission_payment', 'completed'].includes(orderData?.state) && <ReviewFormSection handleReviewOrder={(req) => handleReviewOrder(req)}/>
                      }
                  </div>
                  </InterpreterProfileSidebar>
              </div>

              <OrderSections className="column">

                  <div className="is-hidden-touch">
                    {
                      ['awaiting_certificate_confirmation', 'awaiting_commission_payment', 'completed'].includes(orderData?.state) && <ReviewFormSection handleReviewOrder={(req) => handleReviewOrder(req)}/>
                    }
                  </div>

                  <OrderInfoSection className="is-hidden-touch"/>

                  <div className="section-info is-mobile-border-none">
                  <span className="title">{t("global.show_order_page.contact_details")}</span>
                  <ul className="section-list">
                      <li> {t("global.show_order_page.email")} <span className="is-grey">{interpreter?.email?.includes('#') ? t("global.show_order_page.details_will_be_displayed") : interpreter?.email}</span></li>
                      <li> {t("global.show_order_page.phone")} <span className="is-grey">{interpreter?.mobile_phone?.includes('#') ? t("global.show_order_page.details_will_be_displayed") : interpreter?.mobile_phone}</span></li>
                  </ul>
                  {/* {['completed', 'in_progress', 'awaiting_certificate_confirmation', 'awaiting_commission_payment', 'meeting_confirmed'].includes(orderData?.state) && <button className="button" onClick={() => handleOrderVoucher()}>Получить Ваучер заказа</button>} */}
                  <button className="button" onClick={() => handleOrderVoucher()}>{t("global.show_order_page.get_voucher")}</button>
                  <div className="is-mobile-section">
                      <span className="title">{t("global.show_order_page.payment_info")}</span>
                      {
                        orderData?.payment?.provider !== null &&
                          <>
                            <ul className="section-list">
                            <li>{t("global.show_order_page.payment")} <span className="is-grey">{orderData?.payment?.provider === 'cash' ? t("global.order_page.payment.choice_cash") : (orderData?.payment?.provider === 'invoice' ? t("global.show_order_page.pay_invoice") : t("global.show_order_page.pay_with_card_2"))}</span></li>
                            {orderData?.payment?.provider === 'card' && <li>{t("global.show_order_page.payment_date")} <span className="is-grey">{utcFormat(orderData?.payment?.last_activity_at)}</span></li>}
                            {orderData?.payment?.provider === 'invoice' && <button className="button" onClick={() => handleDownloadInvoice()}>{t("global.show_order_page.download_invoice")}</button>}
                            {orderData?.payment?.provider !== 'card' && <button className="button" onClick={() => alert('open the payment form')}>{t("global.show_order_page.pay_with_card")}</button>}
                            </ul>
                          </>
                      }
                      <button className="button" onClick={() => handlePaymentReceipt()}>{t("global.show_order_page.get_receipt")}</button>
                      <span className="title">{t("global.show_order_page.client_info.title")}</span>
                      <ul className="section-list">
                      <li>{t("global.show_order_page.client_info.name")} <span className="is-grey">{orderData?.client?.full_name}</span></li>
                      <li>{t("global.show_order_page.client_info.phone")} <span className="is-grey">{orderData?.client?.phone}</span></li>
                      <li>{t("global.show_order_page.client_info.email")} <span className="is-grey">{orderData?.client?.email}</span></li>
                      </ul>
                  </div>
                  </div>

                  <div className="section-info">
                  <ul className="section-list">
                      <li>{t("global.show_order_page.cancellation_conditions")} <span className="is-grey" dangerouslySetInnerHTML={{__html: orderData?.cancellation_conditions}} /></li>
                      {/* <li><span className="is-grey">{orderData?.service?.cancellation_text}</span></li> */}
                  </ul>
                  {
                      !['awaiting_certificate_confirmation', 'awaiting_commission_payment', 'completed', 'canceled', 'meeting_confirmed'].includes(orderData?.state) && orderData?.service?.cancellation !== null && <button className="button" onClick={() => setConfirmCancelOrder(true)}>{t("global.show_order_page.cancel_order")}</button>
                  }
                  </div>

              </OrderSections>
              </div>
          </div>
          <ConfirmationCancelOrder active={confirmCancelOrder} setActive={setConfirmCancelOrder} handleCancelOrder={handleCancelOrder} />
          <PaymentReceipt active={paymentReceipt} setActive={setPaymentReceipt}/>
          <OrderVoucher active={orderVoucher} setActive={setOrderVoucher} orderData={orderData} />
          </LayoutBody>
      </ShowOrderPageContext.Provider>}
    </>
  );
}

function ReviewFormSection({handleReviewOrder}) {
  let form = useVisible();
  const buttonRef = useRef()

  const openingAndScroll = () => {
    form.toggle()
  }

  return (
    <div className="section-info">
      <ScrollLink to={"reviewFormShow"}>
        <button ref={buttonRef} className="is-yellow" onClick={openingAndScroll}>{t("global.client_reviews.leave_review")}</button>
      </ScrollLink>
      <div name="reviewFormShow">
        {form.isVisible && <ReviewForm handleReviewOrder={(req) => handleReviewOrder(req)}/>}
      </div>
    </div>
  );
}

function OrderInfoSection({className=""}) {

  const {orderData, interpreter, search, service, paymentType, setPaymentType} = useContext(ShowOrderPageContext)

  let bottomRef = useRef()
  const isScrollToFooter = () =>  {
    useScrollScreenBottom(bottomRef, 0, true)
  }

  let onPayment = async () => {
    let request = {
      order_id: orderData.id,
      payment_type: paymentType
    }

    $hostOld.post("payments", request).then(res => {
      alert('Payment Success')
      window.location.reload();
    }).catch(function (error) {
      if (error.response) {
        toggle()
      }
    });
  }

  return (
    <div className={`section-info is-mobile-border-none ${className}`}>
      <ul className="section-list">
        <li>{search?.city?.name}, {search?.city?.country?.name}</li>
        <li>{t("global.order_page.selected_period")} <span className="is-grey">{search?.intervals_text}</span></li>
        <li>{t('global.order_page.language_pairs')} <span className="is-grey">{search?.language?.name} - {search?.your_language?.name} | {search?.your_language?.name} - {search?.language?.name}</span></li>
        <li>{t("global.show_order_page.address")} <span className="is-grey">{orderData?.meeting_address === 'Upon agreement' ? t("global.show_order_page.upon_agreement") : orderData?.meeting_address}</span></li>
        <li>{t("global.show_order_page.additional_services")} <span className="is-grey">{orderData?.service?.additional_cost}</span></li>
        <li>
            {t("global.order_page.order_price")} 
            {
              orderData?.payment?.provider === 'cash' && <span className="price"> {orderData.amount} {orderData.currency}</span> 
            }
            {
              orderData?.payment?.provider === 'invoice' && <span className="price"> {orderData.service?.amount_currencies?.EUR} {'EUR'}</span> 
            } 
            {
              orderData?.payment?.provider === 'card' && 
                (orderData?.payment?.currency === 'USD' ? <span className="price"> {orderData.service?.amount_currencies?.USD} {'USD'}</span> 
                  : <span className="price"> {orderData.service?.amount_currencies?.EUR} {'EUR'}</span>) 
            } 
            {
              orderData?.payment?.provider === null && <span className="is-grey"> {orderData?.amount} {orderData?.currency}</span> 
            }
            {/* <span className="is-grey">{orderData?.amount} {orderData?.currency}</span> */}
        </li>
      </ul>

      {
        orderData?.payment?.provider === null &&
          <>
            <div style={{background: '#F3DEDE', color: '#AD4344', padding: 12, marginTop: 16, borderRadius: 4}}>
              {t("global.flash_messages.order_not_paid").replace('%{id}', orderData?.id)}.
            </div>
            <PaymentForm isCashAvailable={service?.can_pay_with_cash} onPayment={onPayment} isScrollToFooter={isScrollToFooter} orderData={orderData}/>
          </>
      }
      <div ref={bottomRef}></div>
      {/* {['completed', 'in_progress', 'awaiting_certificate_confirmation', 'awaiting_commission_payment', 'meeting_confirmed'].includes(orderData?.state) && <button className="button">Получить Ваучер заказа</button>}       */}
    </div>
  );
}

function ConfirmationCancelOrder({active, setActive, handleCancelOrder}) {
  return (
    <ModalWindow active={active} setActive={setActive} buttonOk={false}>
      <div className="modal-content-body-wrapper">
          <div className="modal-content-body">
              {t("global.show_order_page.cancel_warning")}
          </div>
      </div>
  
      <div className="modal-content-footer">
          <button className="button is-interpreters-yellow" onClick={handleCancelOrder}>{t("global.show_order_page.continue")}</button>
      </div>
    </ModalWindow>
  )
}

function PaymentReceipt({active, setActive}) {
  return (
    <ModalWindow active={active} setActive={setActive}>
      {t("global.show_order_page.payment_receipt")}
    </ModalWindow>
  )
}

function OrderVoucher({active, setActive, orderData}) {
  return (
    <ModalWindow active={active} setActive={setActive}>
      {/* The order voucher will become available after the order has been accepted by the translator and the free cancellation period has expired. */}
      {
        ['new', 'awaiting_confirmation', 'finding_first_replacement', 'finding_second_replacement', 'awaiting_client_confirmation', 'canceled'].includes(orderData?.state)
        ? t("global.personal_account.voucher_not_ready")
        : t("global.personal_account.voucher_ready_after_confirmation")
      }
    </ModalWindow>
  )
}
