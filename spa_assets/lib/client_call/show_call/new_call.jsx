import "client_call/_styles/show_call/new_call.scss";
import React, { useState } from "react";
import FormSearch from "client_call/form/form";
import apple from 'vendor/images/app-store.png';
import ServiceInfoButton from "client_call/call/service_info_button";
import {t} from 'i18n';

export default function NewCall() {
  let [showHowItWorks, setShowHowItWorks] = useState(false)
  return (
    <div className="new-call">
      <span className="description is-hidden-touch" dangerouslySetInnerHTML={{__html: t("text_translations.hero.thousands_of_professional")}}></span>

      <span className="description">{t("text_translations.hero.connect_an_interpreter")}</span>

      <FormSearch/>

      <div className="button-wrapper">
        <ServiceInfoButton active={showHowItWorks} setActive={setShowHowItWorks} />
        {/* <a href="" className="btn-apple"><img src={apple} alt="App Store"/></a> */}
      </div>
    </div>
  );
}
