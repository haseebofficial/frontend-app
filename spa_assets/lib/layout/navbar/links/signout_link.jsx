import React from "react";
import { signOut } from "login/login_state";
import { useDispatch } from "react-redux";
import api from "api_routes";
import i18n from "i18n";
import { fetchJSON } from "improved_fetch";
import { $host } from "../../../http";
import { useParams } from 'react-router-dom';

export default function SignoutLink() {
  let dispatch = useDispatch();
  const {locale} = useParams();

  let doSignOut = async () => {
    //   fetchJSON.delete(api.userSessionPath()).then(() => {dispatch(signOut()); window.location = "/" + locale + "/spa_login";});
    try {
      let res = await $host.delete(`sessions`);
      dispatch(signOut()); 
      window.location = "/" + locale + "/spa_login"
    } catch (error) {
      // console.log(error)
      dispatch(signOut()); 
      window.location = "/" + locale + "/spa_login"
    }
  } 

  return (
    <a className="navbar-item" testid="logout-link" onClick={doSignOut}>
      <i className="fas fa-sign-out-alt is-hidden-desktop"/>
      {i18n.t("layout.header.sign_out")}
    </a>
  );
}