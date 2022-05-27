import React from "react";
import { consumeGlobals } from 'react_utils/globals';
import { showSupportCallModal } from "./support_call_modal_reducer";
import { requestSupportCallConnect, requestDisconnect } from "twilio/reducer";

export default consumeGlobals(SupportCall, function(state) {
  return { twilioCall: state.twilioCall };
});

function SupportCall(props) {
  let twilioCall = props.twilioCall;
  let i18n = props.i18n;
  let button;

  if (twilioCall.state == "ringing") {
    let disconnectCall = () => { 
      props.dispatch(showSupportCallModal());
      props.dispatch(requestDisconnect());
    };

    button = <div className="call-button disconnect-button" onClick={disconnectCall}></div>;
  } else {  
    let connectCall = () => {
      props.dispatch(showSupportCallModal());
      props.dispatch(requestSupportCallConnect());
    };
    button = <div className="call-button connect-button" onClick={connectCall}></div>;
  }

  return (
    <div className="support-call-container">
      <div>{i18n.t("support_call.text")}</div>
      <div className="button-container">{button}</div>
    </div>
  );
}