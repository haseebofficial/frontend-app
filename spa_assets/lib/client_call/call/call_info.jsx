import "client_call/_styles/call/call_info.scss";
import React, {useEffect, useState} from "react";
import {AvatarCircle} from "user/avatar";
import microphone from "vendor/images/microphone.svg";
import callCancel from "vendor/images/call-cancel.svg";
import { $host } from '../../http';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import {t} from 'i18n';

export default function CallInfo() {
  let [isLoading, setIsLoading] = useState(false)
  let [data, setData] = useState();
  const {id, locale} = useParams()

  const getData = async () => {
    setIsLoading(true)
    try {
      let res = await $host(`interpretation_call_searches/${id}?locale=${locale}`).then(res => res.data)
      console.log(res)
      setData(res)
    } catch (e) {}
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="call-info">
      <div className="avatar">
        <AvatarCircle src={data?.interpreters?.interpreters[0]?.photo_url}/>
      </div>
      <div className="list-wrapper">
        <ul>
          <li className="name">{data?.interpreters?.interpreters[0]?.name}</li>
          <li>{t("global.translation_orders.interpreter_role")}</li>
        </ul>
        <ul>
          <li className="is-regular">{t("global.interpretation_call.interpreter_connected")}</li>
          <li> <span className="time">00:09</span>  <span className="price">0$</span> </li>
        </ul>
      </div>
      <div className="btn-control">
        <a href="#"><img className="call-microphone" src={microphone} alt="Microphone"/></a>
        <a href="#"><img className="call-cancel" src={callCancel} alt="Cancel"/></a>
      </div>
    </div>
  );
}
