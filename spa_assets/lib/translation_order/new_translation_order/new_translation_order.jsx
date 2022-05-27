import 'translation_order/_styles/new_translation_order/new_translation_order.scss';
import React, { useRef, useState, useEffect } from "react";
import { HasRedirection, useRedirection } from "react_utils/redirection";
import useVisible from "react_utils/use_visible";
import routes from "app/routes";
import LayoutBody from "layout/layout_body";
import OrderProgress from "order_utils/progress";
import OrderForm, { PaymentInfo } from "order_utils/form";
import OrderSummary from "translation_order/order_summary";
import { ClientInfoFields } from "order_utils/form";
import PaymentForm, { paymentMethods } from "payment/payment_form";
import { useScrollScreenBottom } from 'react_utils/scroll_link';
import useInput from "react_utils/use_input";
import {t} from 'i18n';
import { useLocation, Redirect, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../login/login_state';
import { $host, $hostOld } from '../../http';
import { signIn } from "login/login_state";
import { useDispatch } from "react-redux";

export let InputValueTranslationContext = React.createContext()

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function NewTranslationOrderPage() {
  let currentUser = useCurrentUser();
  let parsedCurrentUser = JSON.parse(currentUser);
  let dispatch = useDispatch();

  // client info
  let name = useInput(currentUser ? parsedCurrentUser?.name +" "+ parsedCurrentUser?.surname : "", {isEmpty: true, minLength: 2})
  let tel = useInput(currentUser ? parsedCurrentUser?.phone : "", {isTelNumber: true, isEmpty: true})
  let email = useInput(currentUser ? parsedCurrentUser?.email : "", {isEmpty: true, isEmail: true})
  
  // Information for the translator
  let meetingAddress = useInput("", {}, false)
  let description = useInput("", {maxLength: 3000}, false)

  let [submit, setSubmit] = useState(false)
  let [loginTab, setLoginTab] = useState(false)

  // From personal
  let formValid = name.inputValid && tel.inputValid && email.inputValid
  let disabledButton = ((submit && !name.inputValid) || (submit && !tel.inputValid) || (submit && !email.inputValid))

  let orderRedirection = useRedirection();
  // let onPayment = () => orderRedirection.redirectTo(routes.completedTextTranslationOrderPath({id: 1}));
  let { isVisible, toggle } = useVisible();
  let bottomRef = useRef()
  const isScrollToFooter = () =>  {
    useScrollScreenBottom(bottomRef, 0, true)
  }

  let [isLoading, setIsLoading] = useState();
  let paramsLocale = useParams().locale;
  let query = useQuery();
  let [data, setData] = useState({});

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`translation_offers/${query.get("id")}?locale=${paramsLocale}`).then(res => res.data)      
      setData(data)
      if (!currentUser) {
        email.setValue(data?.translation_request?.client_email)
        name.setValue(data?.translation_request?.client_name)
        tel.setValue(data?.translation_request?.client_phone)
      }
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getData();
  }, []);

  const [orderData, setOrderData] = useState({});

  const onOrder = async () => {
    // setSubmit(true)
    // toggle()
    // isScrollToFooter()

    setSubmit(true)
    if(!disabledButton && formValid) {
      let request = {
        translation_offer_id: query.get("id")
      }

      if (!currentUser) {
        request = {
          ...request,
          client: {
            full_name: name.value,
            phone: tel.value,
            email: email.value,
          }
        }
      }

      $host.post("translation_offers/"+query.get("id")+"/orders", request).then(res => {
        setOrderData(res.data)
        toggle()
        isScrollToFooter()
      }).catch(function (error) {
        console.log(error)
        if (error.response) {
          setSubmit(false)
          email.setError(t("global.validator.uniq_email"))
          setTimeout(() => {
            // after 2 second
            setLoginTab(true)
          }, 2000);
        }
      });
    }
  }

  const [paymentType, setPaymentType] = useState({});

  let onPayment = async () => {
    let request = {
      order_id: orderData.order.id,
      payment_type: paymentType
    }

    $hostOld.post("payments", request).then(res => {
      // if (!currentUser) {
      //   dispatch(signIn(orderData.order.client))
      //   window.location = routes.completedTextTranslationOrderPath({id: orderData.order.id})
      // }
      orderRedirection.redirectTo({
        pathname: routes.completedTextTranslationOrderPath({id: orderData.order.id}),
        state: orderData
      });
    }).catch(function (error) {
      // if (!currentUser) {
      //   window.location = routes.completedTextTranslationOrderPath({id: orderData.order.id})
      // }
      if (error.response) {
        toggle()
      }
    });
  }

  return (
    <LayoutBody>
      <HasRedirection redirection={orderRedirection}/>
      <div className="new-translation-order-page">

        <div className="columns is-centered ">
          <div className="column is-10">
            <OrderProgress/>
            <OrderSummary data={data} interpreter={data?.interpreter}>
              <div className="order-price">
                <label className="label">{t("global.order_page.order_price")} {isVisible && <span>30 USD</span>}</label>
                { !isVisible &&
                <div className="control">
                  <div className="select">
                    <select>
                      <option>{data?.translation_offer?.price_id} USD</option>
                    </select>
                  </div>
                </div>
                }
              </div>
            </OrderSummary>
            <InputValueTranslationContext.Provider value={{
              name, tel, email,
              meetingAddress, description,
              submit, setSubmit, disabledButton,
              formValid, loginTab, setLoginTab, paymentType, setPaymentType,
            }}>
              <OrderForm>
                <ClientInfoFields disabledInput={isVisible} className="border-none"/>
              </OrderForm>
              <PaymentInfo isVisible={isVisible} toggle={toggle} isCashAvailable={false} isScrollToFooter={isScrollToFooter} onOrder={onOrder}/>
              {isVisible && <PaymentForm availableMethods={[paymentMethods.card, paymentMethods.invoice]} onPayment={onPayment} isScrollToFooter={isScrollToFooter} orderData={orderData.order}/>}
            </InputValueTranslationContext.Provider>
          </div>
        </div>
      </div>
      <div ref={bottomRef}></div>
    </LayoutBody>
  );
}
