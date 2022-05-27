import React from "react";

import Interpreter from "./partials/interpreter";

export default function DisconnectedCall({callData, commands, t}) {
  return (
    <React.Fragment>
      <div className="modal-body" style={{textAlign: "center"}}>
        <div className="clear"></div>

        <div className="call-participants">
          <Interpreter callData={callData} t={t}/>
        </div>

        <div className="status-container">
          <span className="status">{t("status_texts.ringing")}</span>
        </div>
      </div>

      <div className="modal-footer">
        <div className="call-actions">
          <div className="actions call-ringing">
            <div className="disconnect" testid="disconnect-call" onClick={commands.disconnectCall}></div>
          </div>
          <div className="clear"/>
        </div>
      </div>
    </React.Fragment>
  );
}