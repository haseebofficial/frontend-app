import React, {useEffect, useState, useRef} from "react";
import LayoutBody from "layout/layout_body";
import routes from "app/routes";
import OrderProgress from "order_utils/progress";
import OrderSummary from "order/order_summary";
import OrderMessage from "order_utils/completed_order/order_message";
import { useLocation, Redirect, useParams } from 'react-router-dom';
import {t} from 'i18n';
import { $host, $hostOld } from '../../http';
import PaymentForm from "payment/payment_form";
import { useScrollScreenBottom } from 'react_utils/scroll_link';

export let InputOrderCompleteContext = React.createContext();

export default function CompletedOrder() {

  let params = useLocation();
  const {locale, id} = useParams();
  let [token, setToken] = useState(params?.state?.signin_token);
  let [isLoading, setIsLoading] = useState(true);
  let [interpreter, setInterpreter] = useState();
  let [search, setSearch] = useState();
  let [orderData, setOrderData] = useState({signin_token: params?.state?.signin_token});
  let [client, setClient] = useState({});
  let [service, setService] = useState({});

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`orders/${id}?locale=${locale}${token ? '&signin_token=' + token : '' }`).then(res => res.data)
      setOrderData({...orderData, ...data.order})
      setClient(data.order.client)
      setInterpreter(data.order.interpreter)
      setService(data.order.service)
      setSearch(data.order.search)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getData()
  }, [])

  let bottomRef = useRef()
  const isScrollToFooter = () =>  {
    useScrollScreenBottom(bottomRef, 0, true)
  }
  const [paymentType, setPaymentType] = useState({});

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
    <LayoutBody>
      <div className="completed-order-page">
        <div className="columns is-centered ">
          <div className="column is-10">
            {
              !isLoading ? 
                <>
                  <OrderProgress isCompleted = {true}/>
                  <OrderSummary interpreter={interpreter} search={search} service={service}>
                    <div className="order-price">
                      <span className="label">{t("global.order_page.order_price")}
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
                        orderData?.payment?.provider === null && <span className="price"> {orderData.amount} {orderData.currency}</span> 
                      }
                      </span>
                    </div>

                    {
                      orderData?.payment?.provider === null &&
                        <>
                          <div style={{background: '#F3DEDE', color: '#AD4344', padding: 12, marginTop: 16, borderRadius: 4}}>
                            {t("global.flash_messages.order_not_paid").replace('%{id}', orderData?.id)}.
                          </div>
                          <InputOrderCompleteContext.Provider value={{paymentType, setPaymentType}}>
                            <PaymentForm isCashAvailable={service?.can_pay_with_cash} onPayment={onPayment} isScrollToFooter={isScrollToFooter} orderData={orderData}/>
                          </InputOrderCompleteContext.Provider>
                        </>
                    }
                    <div ref={bottomRef}></div>
                  </OrderSummary>
                  {
                    orderData?.payment?.provider !== null && <OrderMessage orderPath={routes.spaOrderPath({id: id})} orderData={orderData} client={client}/>
                  }
                </>
              : <div className="columns is-flex is-vcentered is-centered"><a style={{border: 'none'}} className="button is-loading">Loading</a></div>
            }
          </div>
        </div>
      </div>
    </LayoutBody>
  );
}

