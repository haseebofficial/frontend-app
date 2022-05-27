import React from "react";

import Timer from "simple_timer/template";
import Interpreter from "../partials/interpreter";
import PhoneParticipant from "./phone_participant";

export default function ConnectedCall({callData, commands, t}) {
  return (
    <React.Fragment>
      <div className="modal-body" style={{textAlign: "center"}}>
        <div className="clear"></div>

        <div className="call-participants">
          <Interpreter callData={callData} t={t}/>
          <strong>PhoneParticipant</strong>
          <PhoneParticipant commands={commands} participantData={callData.participantData}/>
        </div>

        <div className="status-container">
          <span className="status">{t("status_texts.connected")}</span>
        </div>

        <div className="call-duration">
          <Timer duration={callData.duration}/>
        </div>

        <div className="call-price">
          <span>{callData.paymentAmountEur}€</span>
        </div>
      </div>

      <div className="modal-footer">
        <div className="call-actions">
          <Actions commands={commands} isMuted={callData.connection.isMuted}/>
          <div className="clear"/>
        </div>
      </div>
    </React.Fragment>
  );
}

function Actions({commands, isMuted}) {
  return (
    <div className="actions call-connected">
      <ToggleMute isMuted={isMuted} toggleMute={commands.toggleMute}/>
      <div className="disconnect" testid="disconnect-call" onClick={commands.disconnectCall}></div>
    </div>
  );
}

function ToggleMute({isMuted, toggleMute}) {
  if (isMuted) {
    return <i className="icon-mute unmute" testid="unmute-call" onClick={() => toggleMute(false)}></i>;
  } else {
    return <i className="icon-mic mute" testid="mute-call" onClick={() => toggleMute(true)}></i>;
  }
}