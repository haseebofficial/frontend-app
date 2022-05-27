import React from "react";
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { fetchJSON } from "improved_fetch";
import { signIn } from "login/login_state";
import api from "api_routes";
import {$host} from "../http";
import { t } from "i18n";
import { useHistory } from "react-router-dom";

export default function LoginPageForm() {
  let form = useForm();
  let dispatch = useDispatch();
  let history = useHistory();
  
   const submitForm = async (body) => {
    // fetchJSON.post(api.userSessionPath(), {body}).then(
    //   sessionData => dispatch(signIn(sessionData.user)), 
    //   () => form.setError("session", "invalidCredentials", t("login_page.form.error"))
    // );

    try {
      let res = await $host.post(`sessions/password_login`, body);
      let data = res.data
      dispatch(signIn(data.current_session.user))
    } catch (error) {
      // console.log(error)
      if(error?.response?.status === 401 || error?.response?.status === 422){
        form.setError("session", "invalidCredentials", t("login_page.form.error"))
      } else {
        // window.location = "/en/spa"
        history.goBack()
      }
    }

  }

  return (
    <form className="login-form" onSubmit={form.handleSubmit(submitForm)}>
      <MaybeDisplayError error={form.errors.session}/>
      <div className="field">
        <div className="control has-icons-right">
          <input className="input" type="email" name="email" placeholder={t("login_page.form.email")} ref={form.register({required: true})}/>
          <span className="icon is-small is-right">
            <i className="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div className="field">
        <div className="control has-icons-right">
          <input className="input" type="password" name="password" placeholder={t("login_page.form.password")} ref={form.register({required: true})}/>
          <span className="icon is-small is-right">
            <i className="fas fa-lock"></i>
          </span>
        </div>
      </div>

      <div className="field">
        <div className="control is-expanded">
          <label className="checkbox">
            <input type="checkbox" name="rememberMe" ref={form.register}/>
            <span>{t("login_page.form.remember_me")}</span>
          </label>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button type="submit" className="button is-interpreters-yellow is-fullwidth is-size-6 is-uppercase">
            <span>{t("login_page.form.submit")}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function MaybeDisplayError({error}) {
  if (error) {
    return <div style={{backgroundColor: '#F3DEDE', color: '#BF5959', padding: 8, textAlign: 'center', marginBottom: 16}} testid="login-errors">{error.message}</div>;
  } else {
    return null;
  }
}