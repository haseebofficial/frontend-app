// import "order_utils/_styles/form/client_info_fields.scss";
import "phone/_styles/form/info_form.scss";
import React, { useState } from "react";
import OrderTabs from "order_utils/tabs";
// import routes from "app/routes";
import routes from "app/routes";
import { Link, useHistory } from "react-router-dom";
import { useRedirection, HasRedirection } from "react_utils/redirection";
import useInput, {InputField} from "react_utils/use_input";
import {t} from 'i18n';
import {$host} from "../../http"
import { signIn } from "login/login_state";
import { useDispatch } from "react-redux";

let tabs = {info: "info", login: "login"};

export default function InfoForm({className="", params}) {
  let tabState = useState(tabs.info);
  let redirection = useRedirection();

  return (
    <div className={`section-form client-info-fields ${className}`}>
      <OrderTabs>
          <div className="columns tab-names-columns">
            <InfoTab tabState={tabState} tabName={tabs.info}/>
            <InfoTab tabState={tabState} tabName={tabs.login}/>
          </div>
      </OrderTabs>
      <CurrentTabForm tabState={tabState} params={params}/>
    </div>
  );
}

function InfoTab({tabState, tabName}) {
  let [currentTab, setTab] = tabState;
  let tempTabNames = {
    [tabs.info]: t("global.order_page.enter_your_details"),
    [tabs.login]: t("global.order_page.login_button")
  };
  let activityClass = currentTab === tabName ? "is-active tab-name" : "tab-name";

  return <li className={`${activityClass}`} onClick={() => setTab(tabName)}>{tempTabNames[tabName]}</li>;
}

function CurrentTabForm({tabState, params}) {
  let [tab] = tabState;

  switch (tab) {
    case tabs.info: return <ClientInfoFields params={params}/>;
    case tabs.login: return <Form params={params}/>;
  }
}

function ClientInfoFields(params) {
  let dispatch = useDispatch();
  let history = useHistory();
  let redirection = useRedirection();

  let name = useInput("", {isEmpty: true, minLength: 5})
  let tel = useInput("", {isEmpty: true, isTelNumber: true})
  let email = useInput("", {isEmpty: true, isEmail: true})
  let disabled = (name.isEmpty || !name.inputValid) || (tel.isEmpty || !tel.inputValid) || (email.isEmpty || !email.inputValid)

  const postUser = async () => {
    // postCalls();
    $host.post("users", {
      client: {
        email: email.value,
        full_name: name.value,
        phone: tel.value
      }
    }).then(res => {
      dispatch(signIn(res.data.current_session.user))
      setTimeout(() => {
        postCalls();
      }, 1000);
    }).catch(function (error) {
      setTimeout(() => {
        postCalls();
      }, 1000);
    });
  }

  const postCalls = async () => {
    // console.log(params.params)
    let request ={
      language_id: params.params.selectedLanguage,
      scheduled_at: params.params.schedule,
      your_language_id: params.params.currentLanguage.id,
      immediate_call: false
    }
    try {
      let res = await $host.post("interpretation_call_searches", request).then(res => res)
      if (res.status === 200) {
        let data = res.data.interpretation_call_search;
        setTimeout(() => {
          window.location = routes.spaNewInterpretationCallPath() + `?id=${data?.id}`;
          // history.push(routes.spaNewInterpretationCallPath() + `?id=${data?.id}`)
        }, 1000);        
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    //   <form className="info-data" onSubmit={() => redirection.redirectTo(routes.spaNewInterpretationCallPath())}>
      <form className="info-data">
        {/* <HasRedirection redirection={redirection}/> */}
        <div className="columns">
        <div className="column ">
          <div className="field">
            <InputField useInput={name} name="name" type="text" placeholder={t("global.order_page.personal_form.name")} />
          </div>
        </div>
        <div className="column ">
          <div className="field">
            <InputField useInput={tel} name="telNumber" type="tel" placeholder={t("global.show_order_page.client_info.phone")} />
          </div>
        </div>
        <div className="column ">
          <div className="field">
            <InputField useInput={email} name="email" type="text" placeholder={t("global.show_order_page.client_info.email")} />
          </div>
        </div>
        {/* <span className="footer-description footer-description-touch">Нажимая «{t("global.show_order_page.continue2")}», подтверждаю, что ознакомлен(а) и согласен(на) с  <a className="has-text-underline" href="https://dev.interpreters.travel/en/help/privacy_policy" target="_blank">{t("global.order_page.personal_form.policy")}</a> и <a className="has-text-underline" href="https://dev.interpreters.travel/en/help/terms_conditions" target="_blank"> правилами и условиями.</a></span> */}
        <span className="footer-description footer-description-touch" dangerouslySetInnerHTML={{__html: t("global.order_page.personal_form.agreement_calls_text").replace('%{policy}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/terms_conditions" target="_blank">'+t("global.order_page.personal_form.policy")+'</a>').replace('%{terms}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/privacy_policy" target="_blank"> '+t("global.order_page.personal_form.terms")+'</a>')}}></span>
        <div className="column ">
            <div className="field">
                {/* <Link disabled={disabled} to={routes.spaNewInterpretationCallPath()} className="button is-interpreters-yellow is-fullwidth" type="submit">{t("global.show_order_page.continue2")}</Link> */}
                <button disabled={disabled} className="button is-interpreters-yellow is-fullwidth" type="button" onClick={() => postUser()}>{t("global.show_order_page.continue2")}</button>
            </div>
        </div>
        </div>
        {/* <span className="footer-description footer-description-desktop">Нажимая «{t("global.show_order_page.continue2")}», подтверждаю, что ознакомлен(а) и согласен(на) с  <a className="has-text-underline" href="https://dev.interpreters.travel/en/help/privacy_policy" target="_blank">{t("global.order_page.personal_form.policy")}</a> и <a className="has-text-underline" href="https://dev.interpreters.travel/en/help/terms_conditions" target="_blank"> правилами и условиями.</a></span> */}
        <span className="footer-description footer-description-desktop" dangerouslySetInnerHTML={{__html: t("global.order_page.personal_form.agreement_calls_text").replace('%{policy}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/terms_conditions" target="_blank">'+t("global.order_page.personal_form.policy")+'</a>').replace('%{terms}', '<a className="has-text-underline" href="https://dev.interpreters.travel/en/help/privacy_policy" target="_blank"> '+t("global.order_page.personal_form.terms")+'</a>')}}></span>
    </form>
  );
}

function Form(params) {
  let [isLogin, setIsLogin] = useState(true)
  function onLoginForm() {
    setIsLogin(true)
  }
  function onRestorePasswordForm() {
    setIsLogin(false)
  }
  return (
    <>
      {isLogin
        ? <InlineLoginForm onRestorePasswordForm={onRestorePasswordForm} params={params} />
        : <RestorePasswordForm onLoginForm={onLoginForm} />
      }
    </>
  )
}

function InlineLoginForm({onRestorePasswordForm, params}) {
  let dispatch = useDispatch();
  let history = useHistory();
  let redirection = useRedirection();
  let email = useInput("", {isEmpty: true, isEmail: true})
  let password = useInput("", {isEmpty: true, minLength: 6})
  let disabled = (email.isEmpty || !email.inputValid) || (password.isEmpty || !password.inputValid)

  const postUser = async (e) => {
    e.preventDefault();
    // postCalls();
    $host.post("sessions/password_login", {
      email: email.value,
      password: password.value,
    }).then(res => {
      console.log(res)
      dispatch(signIn(res.data.current_session.user))
      setTimeout(() => {
        postCalls();
      }, 1000);
    }).catch(function (e) {
      console.log(e)
      setTimeout(() => {
        postCalls();
      }, 1000);
    });
  }

  const postCalls = async () => {
    // console.log(params.params)
    let request ={
      language_id: params.params.selectedLanguage,
      scheduled_at: params.params.schedule,
      your_language_id: params.params.currentLanguage.id,
      immediate_call: false
    }
    try {
      let res = await $host.post("interpretation_call_searches", request).then(res => res)
      if (res.status === 200) {
        let data = res.data.interpretation_call_search;
        setTimeout(() => {
          window.location = routes.spaNewInterpretationCallPath() + `?id=${data?.id}`;
          // history.push(routes.spaNewInterpretationCallPath() + `?id=${data?.id}`)
        }, 1000);        
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    // <form className="info-data" onSubmit={() => redirection.redirectTo(routes.spaNewInterpretationCallPath())}>
    <form className="info-data" onSubmit={(e) => postUser(e)}>
      {/* <HasRedirection redirection={redirection}/> */}
      <div className="columns inline-login-form">
        <div className="column is-one-third">
          <div className="field">
            <InputField useInput={email} name="email" type="text" placeholder={t("global.forms.email")} />
          </div>

        </div>
        <div className="column is-one-third">
          <div className="field">
            <InputField useInput={password} name="password" type="password"  placeholder={t("global.order_page.password")} />
            <a className="restore-password-link" onClick={onRestorePasswordForm}>{t("global.order_page.forgot_password")}</a>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="field">
            <button disabled={disabled} className="button is-interpreters-yellow is-fullwidth">{t("global.order_page.login")}</button>
          </div>
        </div>
      </div>
    </form>
  );
}

function RestorePasswordForm({onLoginForm}) {
  let email = useInput("", {isEmpty: true, minLength: 3, isEmail: true})
  let disabled = (email.isEmpty || !email.inputValid)
  return (
    <form className="info-data">
      <div className="columns inline-login-form">
        <div className="column">
          <div className="field">
            <InputField useInput={email} name="email" type="text" placeholder={t("global.forms.email")} />
            <div><a className="restore-password-link" onClick={onLoginForm}>{t("global.order_page.login_button")}</a></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <Link disabled={disabled} to={routes.spaNewInterpretationCallPath()} className="button is-interpreters-yellow is-fullwidth">{t("global.order_page.new_password")}</Link>
          </div>
        </div>
      </div>
    </form>
  )
}
