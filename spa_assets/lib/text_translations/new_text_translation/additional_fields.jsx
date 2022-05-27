import "text_translations/_styles/new_text_translation/additional_fields.scss";
import React from "react";
import i18n from "i18n";
import { useFormContext } from "react-hook-form";

export default function AdditionalFieldsForm({getQuotes, openableFormRef}) {
  let t = i18n.scoped("text_translations");
  let { register, formState } = useFormContext();

  let loaderClass = formState.isSubmitting ? "is-loading" : "";
  return (
    <div className="additional-fields" ref={openableFormRef}>
      <div className="info-form-tab">
        {t("form.add_contact_info")}
      </div>

      <div className="columns">

        <div className="column ">
          <div className="field">
            <div className="control">
              <input type="text" ref={register({required: true})} placeholder={t("form.name")} name="clientName"  className="input"/>
            </div>
          </div>
        </div>
        <div className="column ">
          <div className="field">
            <div className="control">
              <input type="text" ref={register({required: true})} placeholder={t("form.phone")} name="clientPhone" className="input"/>
            </div>
          </div>
        </div>
        <div className="column ">
          <div className="field">
            <div className="control">
              <input type="email" ref={register({required: true})} placeholder={t("form.email")} name="clientEmail" className="input"/>
            </div>
          </div>
        </div>
        
      </div>

      <div className="columns">
        <div className="column is-full">
          <div className="field">
            <div className="control">
              <textarea type="text" ref={register({required: true})} placeholder={t("form.description")} name="description" className="textarea is-fullwidth"/>
            </div>
          </div>
            <div className="footer-description">
              <span className="footer-description">{t("form.privacy.text")} <a className="has-text-underline" href="#">{t("form.privacy.privacy_policy")}</a> {t("form.privacy.and")}
                  <a className="has-text-underline" href="#"> {t("form.privacy.terms_conditions")}</a></span>
            </div>
        </div>
      </div>
      <div className="buttons-submit">
        <button type="submit" className={`button is-interpreters-yellow has-text-interpreters-green ${loaderClass}`}>{t("form.submit")}</button>
      </div>
    </div>
  );
}

function Row({children}) {
  return <div className="columns is-variable is-1">{children}</div>;
}

function Column({children}) {
  return <div className="column is-one-third">{children}</div>;
}