import React from "react";

export default function Interpreter({callData, t}) {
  return <div className="call-participant interpreter">
    <img src={callData.interpreterPhoto} className="photo"/>
    <div className="name">{callData.interpreterName}</div>
    <div className="role">{t("interpreter_role")}</div>
  </div>;
}