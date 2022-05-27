import "client_call/_styles/call/keyboard_control.scss";
import React from "react";
import call from "vendor/images/call-btn.svg";
import {t} from 'i18n';

export default function KeyboardControl() {

  return (
    <div className="call-control">
      <div className="keyboard-control">
        <input type="text" placeholder={t("global.interpretation_call.enter_phone_number")} className="input"/>
        <ul className="keyboard">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>+</li>
          <li>0</li>
          <li>#</li>
        </ul>
      </div>
      <a href="#" className="btn-call"><img src={call} alt="Call"/></a>
    </div>
  );
}
