import React, {useEffect, useState} from "react";
import LayoutBody from "layout/layout_body";
import routes from "app/routes";
import OrderProgress from "order_utils/progress";
import OrderSummary from "translation_order/order_summary";
import OrderMessage from "order_utils/completed_order/order_message";
import {t} from 'i18n';
import { $host } from '../../http';
import { useLocation, Redirect, useParams } from 'react-router-dom';

export default function CompletedTranslationOrder() {

  let params = useLocation();
  const {locale, id} = useParams();
  let [token, setToken] = useState(params?.state?.signin_token);
  let [isLoading, setIsLoading] = useState(true);
  let [interpreter, setInterpreter] = useState();
  let [search, setSearch] = useState();
  let [orderData, setOrderData] = useState({signin_token: params?.state?.signin_token});
  let [client, setClient] = useState({});
  let [service, setService] = useState({});
  let [data, setData] = useState({});

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`translation_orders/${id}?locale=${locale}${token ? '&signin_token=' + token : '' }`).then(res => res.data)
      setData(data)
      // setOrderData(data.order)
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

  return (
    <LayoutBody>
      <div className="completed-order-page">
        <div className="columns is-centered ">
          <div className="column is-10">
            <OrderProgress isCompleted = {true}/>
            <OrderSummary data={data} interpreter={data?.order?.interpreter}>
              <div className="order-price">
                <span className="label">{t("global.order_page.order_price")} <span className="price">39.0 CHF</span> </span>
              </div>
            </OrderSummary>
            <OrderMessage orderPath={routes.textTranslationOrderPath({id: parseInt(data?.order?.id)})} orderData={orderData} client={client}/>
          </div>
        </div>
      </div>
    </LayoutBody>
  );
}
