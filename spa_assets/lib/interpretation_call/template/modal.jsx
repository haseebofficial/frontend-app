import React from "react";

import FinishedCallTemplate from "./finished_call";
import ConnectedCallTemplate from "./connected_call";
import DisconnectedCallTemplate from "./disconnected_call";
import RingingCallTemplate from "./ringing_call";

export default function Modal({callData, commands, i18n}) {
  let t = i18n.scoped("interpretation_call.template.modal");
  let BodyTemplate;

  switch(callData.connection.state) {
    case "connected": {
      BodyTemplate = ConnectedCallTemplate;
      break;
    } 
    case "finished": {
      BodyTemplate = FinishedCallTemplate;
      break;
    }
    case "disconnected": {
      BodyTemplate = DisconnectedCallTemplate;
      break;
    }
    case "ringing": {
      BodyTemplate = RingingCallTemplate;
      break;
    }
  }

  return (
    <div className="modal" id="call-modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <BodyTemplate callData={callData} commands={commands} i18n={i18n} t={t}/>
        </div>
      </div>
    </div>
  );
}