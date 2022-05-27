import React from "react";
import Modal from "components/modal";
import { consumeGlobals } from 'react_utils/globals';
import { requestDisconnect, requestSupportCallConnect } from "twilio/reducer";
import { hideSupportCallModal } from "./support_call_modal_reducer";

export default consumeGlobals(SupportCallModal, function(state) {
  let twilioCall = state.twilioCall;
  return { isShown: state.supportCallModal.isShown, twilioCall };
});

function SupportCallModal(props) {
  let isShown = props.isShown;
  let dispatch = props.dispatch;
  let i18n = props.i18n;
  let hide = () => dispatch(hideSupportCallModal());

  let twilioCall = props.twilioCall;
  let operator = twilioCall.call && twilioCall.call.operator;

  let operatorName = operator ? operator.name : i18n.t("support_call.modal.operator_name");

  return (
    <Modal shown={isShown} hide={hide}>
      <Modal.Header>
        {i18n.t("support_call.modal.header")}
      </Modal.Header>

      <Modal.Body>
        <div className="clear"></div>
        <div className="call-participant client">
          <OperatorPhoto operator={operator}/>
          <div className="name">{operatorName}</div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="call-actions">
          <div className="actions call-connected">
            <CallButton dispatch={dispatch} twilioCall={twilioCall}/>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

function OperatorPhoto({operator}) {
  if (operator && operator.photo_url) {
    return <img src={operator.photo_url} className="photo"/>;
  } else {
    return <div className="default-photo"/>;
  }
}

function CallButton({dispatch, twilioCall}) {
  if (twilioCall.state == "ringing") {
    let disconnectCall = () => { 
      dispatch(requestDisconnect());
    };

    return <div className="call-button disconnect-button" onClick={disconnectCall}></div>;
  } else {  
    let connectCall = () => {
      dispatch(requestSupportCallConnect());
    };
    return <div className="call-button connect-button" onClick={connectCall}></div>;
  }
}