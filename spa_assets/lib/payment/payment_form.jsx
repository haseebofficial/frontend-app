import 'payment/_styles/payment_form.scss';
import React, { useState, useContext } from "react";
import { InputValueContext } from "../order/new_order/new_order";
import { InputValueTranslationContext } from '../translation_order/new_translation_order/new_translation_order';
import { InputOrderCompleteContext } from '../order/completed_order/completed_order';
import { ShowOrderPageContext } from '../order/show_order/show_order';
import {t} from 'i18n';
import { format, sub } from 'date-fns';

export let paymentMethods = {invoice: "invoice", cash: "cash", card: "card", notChosen: "notChosen"};

let allMethods = [paymentMethods.card, paymentMethods.cash, paymentMethods.invoice];

export default function OrderPayment({isCashAvailable=true, isAvailableInvoice=true, availableMethods=allMethods, onPayment, isScrollToFooter, orderData}) {
  
  const {setPaymentType} = useContext(InputValueContext) || useContext(InputValueTranslationContext) || useContext(InputOrderCompleteContext) || useContext(ShowOrderPageContext)

  let tabState = useState(paymentMethods.notChosen);
  if (!isCashAvailable) {
    availableMethods = [paymentMethods.card, paymentMethods.invoice]
  } else if (!isAvailableInvoice) {
    availableMethods = [paymentMethods.card, paymentMethods.cash]
  } else if(!isCashAvailable && !isAvailableInvoice) {
    availableMethods = [paymentMethods.card]
  } else {
    availableMethods=allMethods
  }
  

  return (
    <div className="payment-form">
      <ul className="payment-method">
        <li className="is-family-bold">{t("global.order_page.payment.select")}</li>
        {availableMethods.map((m, i) => 
          <PaymentTab key={i} tabState={tabState} tabName={paymentMethods[m]} isScrollToFooter={isScrollToFooter} setPaymentType={setPaymentType} />
        )}
      </ul>
      <CurrentTabForm tabState={tabState} onPayment={onPayment} orderData={orderData}/>
    </div>
  );
}

function PaymentTab({tabState, tabName, isScrollToFooter, setPaymentType}) {
  let [currentTab, setTab] = tabState;
  let tempTabNames = {
    [paymentMethods.card]: t("global.order_page.payment.choice_card"),
    [paymentMethods.cash]: t("global.order_page.payment.cash"),
    [paymentMethods.invoice]: t("global.order_page.payment.invoice")
  };
  let isActive = currentTab === tabName;
  function changeAndScroll() {
    setTab(tabName)
    setPaymentType(tabName)
    isScrollToFooter()
  }

  return (
    <li>  
      <label className="label-checkbox">
        {tempTabNames[tabName]}
        <input type="radio" name="payment" checked={isActive} onChange={changeAndScroll}/>
        <span className="checkmark"/>
      </label>
    </li>
  );
}

function CurrentTabForm({tabState, onPayment, orderData}) {
  let [tab] = tabState;
  let props = {onPayment, orderData};

  switch (tab) {
    case paymentMethods.card: return <CardForm {...props}/>;
    case paymentMethods.cash: return <CashForm {...props}/>;
    case paymentMethods.invoice: return <InvoiceForm {...props}/>;
    case paymentMethods.notChosen: return <NotChosenForm {...props}/>;
  }
}

function CardForm({onPayment, orderData}) {
  return (
    <div className="payment-card">
      <span>{t("global.order_page.payment.card_secure")}</span>
      <span>---card payment form---</span>
      {/* <button className="button is-interpreters-yellow" onClick={onPayment}>{t("global.order_page.payment.order_button")}</button> */}
    </div>
  );
}

function CashForm({onPayment, orderData}) {
  return (
    <div className="payment-cash">
      {/* <p>При выборе варианта &quot;Наличные&quot; вы оплачиваете заказ наличными
          непосредственно переводчику, в валюте переводчика ({orderData?.amount} {orderData?.currency}) по курсу
          действующему на момент оформления заказа. Вы получите квитанцию об
          оплате в валюте переводчика</p> */}
      <p>{t("global.order_page.payment.cash_text").replace('%{amount}', `${orderData?.amount} ${orderData?.currency}`)}</p>  
      <span>{t("global.order_page.payment.info")}</span>

      <button className="button is-interpreters-yellow" onClick={onPayment}>{t("global.order_page.payment.order_button")}</button>
    </div>
  );
}

function InvoiceForm({onPayment, orderData}) {
  const utcFormat = (param) => {
    const date = new Date(param);
    const isoDate = date.toISOString();

    return `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)} UTC`;
  }

  return (
    // <div className="payment-bill">
    //   <span>Вы используете безопасную сделку. Оплата переводчику поступит только после выполнения заказа</span>
    //   <span>Копия счета будет отправлена Вам по электронной почте в pdf формате</span>
    //   <p>Оплатить счет вы можете в любом банке, оформив банковский перевод не позднее чем за 3
    //         банковских дня до даты оплаты, указанной в счете.</p>
    // </div>
    <div>
      <p style={{textAlign: 'center'}} dangerouslySetInnerHTML={{__html: t("global.order_page.payment.invoice_text_secure_deal")}}></p>
      <div className="container-inv" style={{marginTop: 12}}>
        <div className="colored">interpreters.travel</div>
        <div className="info">
          <b>Invoice No:</b> {orderData?.id}<br/>
          <b>DATE:</b> <span>{utcFormat(orderData?.created_at)}</span>
        </div>
        <div className="header">
          <h1 className="title">Invoice</h1>
        </div>
        <div className="text frame">
          <b>Bill to: </b> <span style={{paddingLeft: 2}}>{orderData?.client?.full_name}</span>
          <br/>
          <b>Address: </b> <span style={{paddingLeft: 2}}>{orderData?.client?.email}</span>
        </div>
        <table border="1" width="100%" className="price-table">
          <thead>
            <tr><th style={{paddingLeft: 4}}>Services rendered</th>
            <th style={{textAlign: 'center'}}>Unit price</th>
            <th style={{textAlign: 'center'}}>Qty</th>
            <th style={{textAlign: 'center'}}>Total, EUR</th>
          </tr></thead>
          <tbody><tr style={{textAlign: 'center'}}>
            <td>{orderData?.service?.service_type?.name}, interpreter: {orderData?.interpreter?.name}, city: {orderData?.search?.city?.name + ' - ' + orderData?.search?.city?.country?.name}, {orderData?.search?.intervals_text}</td>
            <td style={{textAlign: 'center'}}>{orderData?.service?.amount_currencies?.EUR} EUR</td>
            <td style={{textAlign: 'center'}}>1</td>
            <td style={{textAlign: 'center'}}>{orderData?.service?.amount_currencies?.EUR} EUR</td>
          </tr>
        </tbody></table>
        <div align="right">
          <em>Subtotal</em>: {orderData?.service?.amount_currencies?.EUR} EUR
          <br/>
          <b>Total</b>: {orderData?.service?.amount_currencies?.EUR} EUR
        </div>
        Payment terms: payable until {format(sub(new Date(orderData?.since), {days: 4}), 'dd MMM yyyy, hh:mm')}
        <div className="footer-inv">
          <span className="name">INTERPRETERS.TRAVEL OÜ</span>
          <span className="reg-num">Registration number: 16422855</span>    
          <div className="address">
            Registred office: Harju maakond, Tallinn, Kesklinna linnaosa, Vesivärava tn 50-201, 10152. Office phone: +357 22 008 050. Email: office@interpreters.travel
          </div>
        </div>
        <div className="frame">
          <table className="center">
            <tbody><tr><td>Bank:</td><td>TransferWise Europe SA</td></tr>
            <tr><td>Account Holder:</td><td>INTERPRETERS.TRAVEL OÜ</td></tr>
            <tr><td>SWIFT:</td><td>TRWIBEB1XXX</td></tr>
            <tr><td>IBAN:</td><td>BE07967254683566</td></tr>
          </tbody></table>
        </div>
      </div>

      <div style={{align: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>        
        <p style={{marginTop: 12}}>
          {t("global.order_page.payment.invoice_text2")}
        </p>
      </div>
      <div style={{align: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
        <button className="button is-interpreters-yellow" onClick={onPayment}>{t("global.order_page.payment.order_button")}</button>        
      </div>
    </div>
  );
}

function NotChosenForm({onPayment}) {
  return (
    <div className="payment-not-chosen">
      
    </div>
  );
}