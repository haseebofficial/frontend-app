import React from "react";

export default function FinishedCall({commands, t}) {
  return (
    <div className="modal-body" style={{textAlign: "center"}}>
      <div className="call-completed">
        <div className="question">{t("finished_call.question")}</div>
        <div className="actions">
          <a href="#" onClick={commands.finishCall} className="btn btn-success" testid="finish-call">
            {t("finished_call.answer_yes")}
          </a>
          <span className="continue-call" onClick={commands.resetCall} testid="reset-call">
            {t("finished_call.answer_no")}
          </span>
        </div>
      </div>
    </div>
  );
}