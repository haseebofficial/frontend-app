import "order_utils/_styles/form/client_info_fields.scss";
import React, { useState, useContext, useEffect } from "react";
import OrderTabs from "order_utils/tabs";
import LoginForm from "user/inline_login_form";
import  { InputField } from "react_utils/use_input";
import { InputValueContext } from "order/new_order/new_order"
import { useHistory, useParams } from "react-router-dom";
import { InputValueTranslationContext } from "translation_order/new_translation_order/new_translation_order";
import {useCurrentUser} from "../../login/login_state";
import {t} from 'i18n';

let tabs = {info: "info", login: "login"};
let currentUser = useCurrentUser();

export default function ClientInfo({className="", disabledInput}) {
  
  let tabState = useState('info');
  let url = useHistory();
  const {locale} = useParams();
  let pathname = url.location.pathname
  let { name, tel, email, submit, loginTab } = (pathname === `/${locale}/spa/orders/new`) ? useContext(InputValueContext) : useContext(InputValueTranslationContext)

  return (
    <div className={`section-form client-info-fields ${className}`}>
      { !disabledInput
        ? <OrderTabs>
          <InfoTab tabState={tabState} tabName={tabs.info}/>
          {!currentUser && <> <InfoTab tabState={tabState} tabName={tabs.login}/> {loginTab && <span style={{paddingLeft: 6}} className="input-label-error">{t("global.order_page.login_password_info").replace('%{mail}', email.value)}</span>} </>}
        </OrderTabs>
        : <OrderTabs>
          <div className=" info-form-tab">{t("global.show_order_page.client_info.title")}</div>
        </OrderTabs>
      }
      <CurrentTabForm tabState={tabState} disabledInput={disabledInput}/>
    </div>
  );
}

function InfoTab({tabState, tabName}) {
  let [currentTab, setTab] = tabState;
  let tempTabNames = {
    [tabs.info]: t("global.order_page.personal_form.title"),
    [tabs.login]: t("global.order_page.login_button")
  };
  let activityClass = currentTab === tabName ? "is-active" : "";

  const {loginTab, setLoginTab} = useContext(InputValueContext) || useContext(InputValueTranslationContext)

  useEffect(() => {
    if (loginTab) {
      setTab('login')
    } 
  }, [loginTab]);

  useEffect(() => {
    if (currentTab !== 'login') {
      setLoginTab(false)
    } 
  }, [currentTab]);

  return <li className={`${activityClass}`} onClick={() => setTab(tabName)}>{tempTabNames[tabName]}</li>;
}

function CurrentTabForm({tabState, disabledInput}) {
  let [tab] = tabState;

  switch (tab) {
    case tabs.info: return <ClientInfoFields disabledInput={disabledInput}/>;
    case tabs.login: return <LoginForm/>;
  }
}

function ClientInfoFields({disabledInput}) {
  let url = useHistory()
  const {locale} = useParams();
  let pathname = url.location.pathname
  let { name, tel, email, submit } = (pathname === `/${locale}/spa/orders/new`) ? useContext(InputValueContext) : useContext(InputValueTranslationContext)

  return (
    <div className="columns">
      <div className="column is-one-third">
        <div className="field">
          <InputField useInput={name} submit={submit} name="name" type="text" placeholder={t("global.order_page.personal_form.name")} classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput || currentUser} />
        </div>
      </div>
      <div className="column is-one-third">
        <div className="field">
          <InputField useInput={tel} submit={submit} name="tel" type="text" placeholder={t("global.forms.phone")} classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
        </div>
      </div>
      {
        !currentUser &&
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={email} submit={submit} name="email" type="text" placeholder={t("global.order_page.personal_form.email")} classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>
          </div>
      }
    </div>
  );
}