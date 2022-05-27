import 'order/_styles/new_order/new_order.scss';
import React, {useRef, useState, useEffect, useContext} from "react";
import { HasRedirection, useRedirection } from "react_utils/redirection";
import useVisible from "react_utils/use_visible";
import routes from "app/routes";
import LayoutBody from "layout/layout_body";
import OrderProgress from "order_utils/progress";
import OrderTabs from "order_utils/tabs";
import OrderSummary from "order/order_summary";
import OrderForm, { PaymentInfo } from "order_utils/form";
import PrivateForm from "order/new_order/private_form";
import CompanyForm from "order/new_order/company_form";
import PaymentForm from "payment/payment_form";
import { useScrollScreenBottom } from 'react_utils/scroll_link';
import useInput from "react_utils/use_input";
import {$host, $hostOld} from "../../http"
import { useLocation, Redirect, useParams } from 'react-router-dom';
import {useCurrentUser} from "../../login/login_state";
import {t} from 'i18n';

let tabs = {company: "company", personal: "personal"};

export let InputValueContext = React.createContext();

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function NewOrderPage() {
  let currentUser = useCurrentUser();
  let parsedCurrentUser = JSON.parse(currentUser);

  // personal state
  let legalForm = useInput("", {}, false)
  let companyName = useInput("", {isEmpty: true, minLength: 5})
  let scope = useInput("", {isEmpty: true, minLength: 5})
  let legalAddress = useInput("", {isEmpty: true, minLength: 5})
  let companyPhone = useInput("", {isEmpty: true, isTelNumber: true})
  let iin = useInput("", {isEmpty: true, minLength: 5})

  // client info
  let name = useInput(currentUser ? parsedCurrentUser?.name +" "+ parsedCurrentUser?.surname : "", {isEmpty: true, minLength: 2})
  let tel = useInput(currentUser ? parsedCurrentUser?.phone : "", {isTelNumber: true, isEmpty: true})
  let email = useInput(currentUser ? parsedCurrentUser?.email : "", {isEmpty: true, isEmail: true})

  // Information for the translator
  let meetingAddress = useInput("", {}, false)
  let description = useInput("", {maxLength: 3000}, false)

  let [submit, setSubmit] = useState(false)

  let tabState = useState(tabs.personal);
  let orderRedirection = useRedirection();
  
  let { isVisible, toggle } = useVisible();
  let bottomRef = useRef()
  const isScrollToFooter = () =>  {
    useScrollScreenBottom(bottomRef, 0, true)
  }

  // Conditions for disabled buttons
  let [tab] = tabState
  // From personal
  let personal = tab === "personal"
  let personalInputsValid = name.inputValid && tel.inputValid && email.inputValid
  let disabledPersonal = ((submit && !name.inputValid) || (submit && !tel.inputValid) || (submit && !email.inputValid))
  // From company
  let company = tab === "company"
  let companyInputsValid = personalInputsValid && companyName.inputValid && scope.inputValid && legalAddress.inputValid && companyPhone.inputValid && iin.inputValid
  let disabledCompany = disabledPersonal || ((submit && !companyName.inputValid) || (submit && !scope.inputValid) || (submit && !legalAddress.inputValid) || (submit && !companyPhone.inputValid) || (submit && !iin.inputValid))

  let formValid, disabledButton
  if(personal) {
    formValid = personalInputsValid
    disabledButton = disabledPersonal
  } else {
    formValid = companyInputsValid
    disabledButton = disabledCompany
  }

  let [loginTab, setLoginTab] = useState(false)
  let [isLoading, setIsLoading] = useState()
  let [interpreter, setInterpreter] = useState({})
  let [search, setSearch] = useState({})
  let [service, setService] = useState({})
  let [data, setData] = useState()
  const [currency, setCurrency] = useState('USD')
  let paramsLocale = useParams().locale;
  let query = useQuery();
  const [isAvailableInvoice, setAvailableInvoice] = useState(true);

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`searches/${query.get("search_id")}/interpreters/${query.get("interpreter_id")}?locale=${paramsLocale}`).then(res => res.data)
      setInterpreter(data.interpreter)
      let services = data.interpreter.service;
      let selectedService = services.filter(val => val.id === Number(query.get("service_id")))
      setService(selectedService[0])
      setSearch(data.search)
      setData(data)

      // invoice available condition
      let currentDate = new Date();
      let currentDatePlusFourDay = new Date();
      currentDatePlusFourDay.setDate(currentDate.getDate()+4);
      let sinceDate = new Date(data.search.intervals[0].since);
      console.log(currentDate)
      console.log(currentDatePlusFourDay)
      console.log(sinceDate)
      if (currentDatePlusFourDay > sinceDate) {
        setAvailableInvoice(false)
        // alert('invoice false')
      }

      setIsLoading(false)
    } catch (e) {}
  }
  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if (tel.telNumberError) {
      // console.log(tel)
      tel.setError(t("global.validator.phone_format"))
    }
  }, [submit])

  const [orderData, setOrderData] = useState({});

  const onOrder = async () => {
    setSubmit(true)
    if(!disabledButton && formValid) {
        let request = {
        interpreter_id: query.get("interpreter_id"),
        search_id: query.get("search_id"),
        service_id: query.get("service_id"),
        client_currency_code: currency,
        meeting_address: meetingAddress.value,
        detail_information: description.value,
      }
      if (company) {
        request = {
          ...request,
          company_information: {
            legal_form: legalForm.value,
            name: companyName.value,
            scope: scope.value,
            company_address: legalAddress.value,
            phone: companyPhone.value,
            inn: iin.value
          }
        }
      }

      var formData = new FormData();
      var file = document.querySelector('#resume');
      if (file.files[0]) {
        formData.append("file", file.files[0]);
      }
      for (var key in request) {
        formData.append(key, request[key]);
      }
      formData.append("client[full_name]", name.value);
      formData.append("client[phone]", tel.value);
      formData.append("client[email]", email.value);
      // console.table([...formData])

      $host.post("orders", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        setOrderData(res.data.order)
        toggle()
        isScrollToFooter()

        // invoice available condition
        let currentDate = new Date();
        let currentDatePlusFourDay = new Date();
        currentDatePlusFourDay.setDate(currentDate.getDate()+4);
        let sinceDate = new Date(res.data.order.since);
        console.log(currentDate)
        console.log(currentDatePlusFourDay)
        console.log(sinceDate)
        if (currentDatePlusFourDay > sinceDate) {
          setAvailableInvoice(false)
        }

      }).catch(function (error) {
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
      order_id: orderData.id,
      payment_type: paymentType
    }

    $hostOld.post("payments", request).then(res => {
      orderRedirection.redirectTo({
        pathname: routes.spaCompletedOrderPath({id: orderData.id}),
        state: orderData
      });
    }).catch(function (error) {
      if (error.response) {
        toggle()
      }
    });
  }

  if (query.get("search_id") === null || query.get("interpreter_id") === null || query.get("service_id") === null)
    return <Redirect to={`${paramsLocale}/spa`} />

  return (
    <LayoutBody>
      <HasRedirection redirection={orderRedirection}/>
      <div className="new-order-page">
        <div className="columns is-centered ">
          <div className="column is-10">
            <OrderProgress menuClicking={true}/>
            <OrderSummary interpreter={interpreter} search={search} service={service} canChangeDate={true} isVisible={isVisible}>
              <div className="order-price">
                <label className="label">{t("global.order_page.order_price")} {isVisible && <span>{service?.amount_currencies[currency]} {currency}</span>}</label>
                { !isVisible &&
                <div className="control">
                  <div className="select">
                    <select onChange={(e) => setCurrency(e.target.value)} value={currency}>
                      {service?.amount_currencies?.EUR && <option value={"EUR"}>{service?.amount_currencies?.EUR} EUR</option>}
                      {service?.amount_currencies?.RUB && <option value={"RUB"}>{service?.amount_currencies?.RUB} RUB</option>}
                      {service?.amount_currencies?.USD && <option value={"USD"}>{service?.amount_currencies?.USD} USD</option>}
                    </select>
                  </div>
                </div>
                }
              </div>
            </OrderSummary>
            { !isVisible && useParams().locale === 'ru' &&
              <OrderTabs isMobileFull={true}>
                <OrderTab tabState={tabState} tabName={tabs.personal}/>
                <OrderTab tabState={tabState} tabName={tabs.company}/>
              </OrderTabs> 
            }
            <InputValueContext.Provider 
              value={{legalForm, companyName, scope, legalAddress, companyPhone, iin, 
              name, tel, email,
              meetingAddress, description,
              submit, setSubmit, disabledButton,
              formValid, paymentType, setPaymentType, loginTab, setLoginTab, search
              }}>
                <OrderForm>
                  <CurrentTabForm tabState={tabState} disabledInput={isVisible}/>
                </OrderForm>
                <PaymentInfo isCashAvailable={service?.can_pay_with_cash} isAvailableInvoice={isAvailableInvoice} isVisible={isVisible} toggle={toggle} isScrollToFooter={isScrollToFooter} onOrder={onOrder} />
                {isVisible && <PaymentForm isCashAvailable={service?.can_pay_with_cash} isAvailableInvoice={isAvailableInvoice} onPayment={onPayment} isScrollToFooter={isScrollToFooter} orderData={orderData}/>}
            </InputValueContext.Provider>
          </div>
        </div>
      </div>
      <div ref={bottomRef}></div>
    </LayoutBody>
  );
}


function OrderTab({tabState, tabName}) {
  let [currentTab, setTab] = tabState;
  let tempTabNames = {
    [tabs.personal]: "Оформить заказ на частное лицо",
    [tabs.company]: "Оформить заказ на компанию"
  };
  let activityClass = currentTab === tabName ? "is-active" : "";

  return <li className={`${activityClass}`} onClick={() => setTab(tabName)}>{tempTabNames[tabName]}</li>;
}

function CurrentTabForm({tabState, disabledInput}) {
  let [tab] = tabState;

  switch (tab) {
    case tabs.personal: return <PrivateForm disabledInput={disabledInput}/>;
    case tabs.company: return <CompanyForm disabledInput={disabledInput}/>;
  }
}