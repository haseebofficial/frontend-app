import 'user/_styles/interpreter/profile_sidebar/contact_form.scss';
import React, { useRef, useState, useContext, useEffect } from "react";
import { getAppLocale } from "i18n";
import useInput, {InputField, TextareaField} from "react_utils/use_input";
import useVisible from "react_utils/use_visible";
import ScrollLink from 'react_utils/scroll_link';
import {$host} from "../../../http"
import { ShowOrderPageContext } from '../../../order/show_order/show_order';
import { ShowTranslationOrderPageContext } from '../../../translation_order/show_translation_order/show_translation_order';
import { ProfilePageContext } from '../../../profile/profile';
import { useCurrentUser } from "login/login_state";
import { useLocation } from 'react-router-dom';
import {t} from 'i18n';

export default function ContactForm({preliminaryRequest = true}) {
  let currentUser = useCurrentUser();
  let currentUserParsed = JSON.parse(currentUser);
  let { interpreter, search } = useContext(ProfilePageContext) || useContext(ShowOrderPageContext) || useContext(ShowTranslationOrderPageContext)
  let form = useVisible();
  let locale = getAppLocale()
  let name = useInput(currentUserParsed?.name ? currentUserParsed?.name : "", {isEmpty: true, minLength: 2})
  let email = useInput(currentUserParsed?.email ? currentUserParsed?.email : "", {isEmpty: true, isEmail: true})
  let phone = useInput(currentUserParsed?.phone ? currentUserParsed?.phone : "", {isEmpty: true, isTelNumber: true})
  let message = useInput("", {maxLength: 3000, isEmpty: true,}, false)
  let [sendToSimilar, setSendToSimilar] = useState(false)
  let [onClickSubmit, setOnClickSubmit] = useState(false)
  const messageRef = useRef()
  const requestRef = useRef()
  const buttonRef = useRef()
  const scrollElement = preliminaryRequest ? "message" : "request"
  let params = useLocation()
  let [token, setToken] = useState(params?.state?.signin_token)
  let [success, setSuccess] = useState(false)

  // let formValid = name.inputValid && phone.inputValid && email.inputValid
  let formValid = name.inputValid && email.inputValid
  // let disabledButton = ((onClickSubmit && !name.inputValid) || (onClickSubmit && !phone.inputValid) || (onClickSubmit && !email.inputValid))
  let disabledButton = onClickSubmit

  useEffect(() => {
    console.log(message)
    if (phone.telNumberError) {
      phone.setError(t("global.validator.phone_format"))
    }
    if (message.isValid) {
      message.setError(t("global.validator.required"))
    }
  }, [onClickSubmit])

  const onSubmit = (e) => {
    e.preventDefault()
    setOnClickSubmit(true)
    // if(!disabledButton) {
      // let inputs = {
      //   locale,
      //   name: name.value, 
      //   email: email.value, 
      //   phone: phone.value, 
      //   message: message.value, 
      //   send_to_similar: sendToSimilar
      // }
      let inputs = {
        locale,
        name: currentUserParsed?.name ? currentUserParsed?.name : name.value, 
        email: currentUserParsed?.email ? currentUserParsed?.email : email.value, 
        phone: currentUserParsed?.phone ? currentUserParsed?.phone : phone.value, 
        message: message.value, 
        send_to_similar: sendToSimilar
      }
      console.log(inputs)
      $host.post(`searches/${search.id}/interpreters/${interpreter.id}/messages${token ? '?signin_token=' + token : '' }`, inputs).then(res => {
        console.log(res)
        form.toggle();
        setSuccess(true);
      }).catch(function (error) {
        console.log(error)
        // message.setError(t("global.validator.required"))
      });
    // }
  }

  return (
    <React.Fragment>
      <div name="request" ref={requestRef} className="profile-section has-text-centered">
        <ScrollLink to={scrollElement} offset={-10}>
          <button ref={buttonRef} className="button is-interpreters-yellow" onClick={form.toggle}>{t("global.forms.send_message_to_int")}</button>
        </ScrollLink>
        {preliminaryRequest && <p name="message" ref={messageRef} className="profile-paragraph">{t("global.show_interpreter.ticket_text")}</p>}
      </div>

      {form.isVisible &&
        <form className="profile-form">
          {(preliminaryRequest && currentUserParsed === null) && <>
            <div className="main-field">
              <InputField useInput={name} submit={onClickSubmit} name="name" type="text" placeholder={t("global.forms.name")} />
            </div>
            <div className=" main-field">
              <InputField useInput={email} submit={onClickSubmit} name="email" type="text" placeholder={t("global.forms.email")} />
            </div>
            <div className=" main-field">
              <InputField useInput={phone} submit={onClickSubmit} name="phone" type="text" placeholder={t("global.forms.phone")} />
            </div>
          </>}
          <div className="main-field">
            <TextareaField classes="textarea" useInput={message} submit={onClickSubmit} name="message" type="text" placeholder={t("global.forms.order_message")} />
          </div>

          <div className="checkbox-container">
            {preliminaryRequest && <>
              <label className="label-checkbox">
                {t("global.forms.send_to_all")}
                <input name="send_to_similar" type="checkbox" checked={sendToSimilar} onChange={() => setSendToSimilar(!sendToSimilar)}/>
                <span className="checkmark"/>
              </label>
            </>}
          </div>
          <button className="button is-interpreters-yellow" onClick={onSubmit}>{t("global.forms.send_button")}</button>
        </form>
      }
      {
        success && <p style={{color: 'green', textAlign: 'center'}}>{t("global.flash_messages.interpreter_message_created")}</p>
      }
    </React.Fragment>
  );
}
