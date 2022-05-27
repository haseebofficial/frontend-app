import "client_call/_styles/call/call.scss";
import React, {useEffect, useState, useContext} from "react";
import LayoutBody from "layout/layout_body";
// import KeyboardControl from "client_call/call/keyboard_control";
// import ClientTabs from "client_utils/tabs";
// import CallInfo from "./call_info";
import {t} from 'i18n';
import InterpretationCall from "interpretation_call";
import { useDispatch} from 'react-redux';
import { $host } from '../../http';
import { interpretationCall as interpretationCallUrls } from "/urls/api";
import { useParams  } from "react-router-dom";
import {updateCurrentCall,requestConnect} from "../../twilio/reducer"
import {ContextTwilio} from "app/app_root"
 
export default function CallPage() {
  var _id =useParams().id
  const _dispatch= useDispatch();
  let twilioInfo = useContext(ContextTwilio)

  useEffect(() => {
    $host.get(interpretationCallUrls.showUrl(_id))
      .then((json) => {
        _dispatch(updateCurrentCall( json.data.interpretation_call));
      });
  },[]);

  return (

    <LayoutBody>
      <div className="call-page">
          <InterpretationCall />
        {/* <div style={{"display": "content"}} className="columns is-centered" >
          <InterpretationCall />
        </div> */}
        {/* <ClientTabs>
          <li className="client-tabs-link">
            {t("client_call.tab.my_calls")}
          </li>
          <li className="client-tabs-link active">
            {t("client_call.tab.new_call")}
          </li>
        </ClientTabs> */}
        {/* <div className="columns is-centered">
          <div className="column is-5">
           {_IsAddingExternalNumber && <KeyboardControl/> }
          </div>
        </div>

        <div className="columns is-centered">
          <div className="column is-8">
            <CallInfo/>
          </div>
        </div> */}

      </div>
    </LayoutBody>
  );
}

