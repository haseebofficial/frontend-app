import "user/_styles/inline_login_form.scss";
import React, { useState, useContext, useEffect } from "react";
import useInput, {InputField} from "react_utils/use_input";
import { InputValueContext } from "../order/new_order/new_order";
import { InputValueTranslationContext } from "translation_order/new_translation_order/new_translation_order";
import {$host, $hostOld} from "../http";
import { t } from "i18n";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../login/login_state";

export default function InlineLoginForm() {
  let [loginForm, setLoginForm] = useState(true);
  let [isSuccess, setSuccess] = useState(false)

  return (
    <>
      {
        isSuccess &&
          <div className="alert-success">
            {t("global.passwords.send_instructions")}
          </div>
      }
      { loginForm
        ? <LoginForm setLoginForm={setLoginForm} />
        : <RestorePasswordForm setLoginForm={setLoginForm} setSuccess={setSuccess} isSuccess={isSuccess} />
      }
    </>
  );
}

function LoginForm({setLoginForm}) {
  const contextEmail = useContext(InputValueContext)?.email?.value || useContext(InputValueTranslationContext)?.email?.value;
  const {loginTab} = useContext(InputValueContext) || useContext(InputValueTranslationContext);
  let dispatch = useDispatch();
  let history = useHistory();

  let email = useInput(contextEmail ? contextEmail : "", {isEmpty: true, minLength: 3, isEmail: true})
  let password = useInput("", {isEmpty: true, minLength: 5, maxLength: 36})
  let [submit, setSubmit] = useState(false)
  let disabled = ((email.isDirty || password.isDirty) && (!email.inputValid || !password.inputValid)) || ((submit && !password.inputValid) || submit && !email.inputValid)
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmit(true)
    if(email.inputValid && password.inputValid) {
      // alert(`email: ${email.value}, password: ${password.value}`)
      try {
        let res = await $host.post(`sessions/password_login`, {
          email: email.value,
          password: password.value
        });
        let data = res.data
        dispatch(signIn(data.current_session.user))
      } catch (error) {
        // console.log(error)
        if(error?.response?.status === 401 || error?.response?.status === 422){
          email.setError(t("login_page.form.error"))
          password.setError(t("login_page.form.error"))
        } else {
          history.go(0)
        }
      }
    }
  }
  return(
    <form onSubmit={onSubmit}>
			<div className="columns inline-login-form">
				<div className="column is-one-third">
					<div className="field">
						<InputField useInput={email} submit={submit} name="email" type="text" placeholder={t("global.order_page.personal_form.email")} />
					</div>

				</div>
				<div className="column is-one-third">
					<div className="field">
						<InputField useInput={password} submit={submit} name="password" type="password"  placeholder={t("global.order_page.password")} />
						<div className="restore-button"><a onClick={() => setLoginForm(false)} className="restore-password-link">{t("global.order_page.forgot_password")}</a></div>
					</div>
				</div>
				<div className="column is-one-third">
					<div className="field">
						<button disabled={disabled} className="button is-interpreters-yellow is-fullwidth">{t("global.order_page.login")}</button>
					</div>
				</div>
			</div>
		</form>
	)
}
  
function RestorePasswordForm({setLoginForm, setSuccess, isSuccess}) {
  let email = useInput("", {isEmpty: true, minLength: 3, isEmail: true})
  let [submit, setSubmit] = useState(false)
  let disabled = (email.isDirty && !email.inputValid) || (submit && !email.inputValid)
    
  const onSubmit = async(e) => {
    e.preventDefault()
    setSubmit(true)
    if(email.inputValid) {
      try {
        let res = $hostOld.post(`v1/users/password`, {
          email: email.value,
        });
        let data = res.data
        setSuccess(true);
          setTimeout(() => {
            setLoginForm(true)
          }, 1000)
      } catch (error) {
        alert('Something went wrong, please contact administrator');
      }
    }
  }
  return(
    <>
			<form  onSubmit={onSubmit}>
				<div className="columns inline-login-form">
					<div className="column ">
						<div className="field">
							<InputField useInput={email} submit={submit} name="email" type="text" placeholder={t("global.order_page.personal_form.email")} />
							<div className="restore-button"><a onClick={() => setLoginForm(true)} className="restore-password-link">{t("global.order_page.login_button")}</a></div>
						</div>

					</div>
					<div className="column">
						<div className="field">
							<button disabled={disabled} className="button is-interpreters-yellow is-fullwidth">{t("global.order_page.new_password")}</button>
						</div>
					</div>
				</div>
			</form>
		</>
  )
}