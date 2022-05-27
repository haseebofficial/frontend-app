import "text_translations/_styles/new_text_translation/main_fields.scss";
import React from "react";
import { useFormContext } from "react-hook-form";
import i18n from "i18n";
import { useDiametricInputPair } from "form_utils/diametric_input_pair";
import { SourceLanguageField, TargetLanguageField } from "./main_fields/language_fields";
import SpecializationField from "./main_fields/specialization_field";
import RequirementsField from "./main_fields/requirements_field";
import DatetimeField from "./main_fields/datetime_field";
import ScrollLink from "react_utils/scroll_link";

export default function MainFields({setGetQuotes, openableFormRef}) {
  let t = i18n.scoped("text_translations");
  let { formState } = useFormContext();
  let [sourceLang, yourLang] = useDiametricInputPair(["", ""]);
  let onSubmit = e => {
    e.preventDefault();
    setGetQuotes(true)
  };

  let loaderClass = formState.isSubmitting ? "is-loading" : "";
  return (
    <div className="main-fields">
      <Row>
        <Column>
          <SourceLanguageField diametricInput={sourceLang}/>
        </Column>
        <Column>
          <TargetLanguageField diametricInput={yourLang}/>
        </Column>
        <Column>
          <SpecializationField/>
        </Column>
      </Row>
      <Row>
        <Column>
          <RequirementsField/>
        </Column>
        <Column>
          <DatetimeField/>
        </Column>
        <Column>
          <div className="field main-field">
            <label className="label label-empty">Quotes</label>
            <div className="control">
              <ScrollLink to="textTranslationForm" offset={12}>
                <button onClick={onSubmit} className={`button is-interpreters-yellow has-text-interpreters-green is-fullwidth is-uppercase ${loaderClass}`}>
                  <span>{t("form.submit")}</span>
                </button>
              </ScrollLink>
            </div>
          </div>
        </Column>
      </Row>
    </div>
  );
}

function Row({children}) {
  return <div className="columns is-variable is-5">{children}</div>;
}

function Column({children}) {
  return <div className="column is-one-third">{children}</div>;
}
