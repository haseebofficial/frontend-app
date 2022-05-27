import "text_translations/_styles/new_text_translation/text_translation_form.scss";
import React, { useState, useRef } from "react";
import api from "api_routes";
import { t } from "i18n";
import { fetchJSON } from "improved_fetch";
import { FormContext, useForm } from "react-hook-form";
import useModal, { ModalContext } from "modal/use_modal";
import AttachmentsDropzone, { useDropzoneAttachments } from "./attachments_dropzone";
import MainFields from "./main_fields";
import { validateAttachments } from "./main_fields/requirements_field";
import AdditionalFields from "./additional_fields";

export default function TextTranslationRequestFormBox() {
  let [lastCreatedTranslation, setLastCreatedTranslation] = useState(null);
  let reset = () => setLastCreatedTranslation(null);

  return (  
    <div className="columns">
      <div className="column is-full">
        {lastCreatedTranslation ?
          <TranslationCreatedBox translation={lastCreatedTranslation} reset={reset}/>
          :
          <AttachmentsDropzone>
            <RequestForm onRequestCreated={setLastCreatedTranslation}/>
          </AttachmentsDropzone>
        }
      </div>
    </div>
  );
}

function TranslationCreatedBox({translation, reset}) {
  let languages = t(`languages.${translation.sourceLanguage}`) + "-" + t(`languages.${translation.targetLanguage}`);

  return (
    <div className="translation-created-box" testid="translation-created-box">
      <div className="columns is-centered is-vcentered">
        <div className="column is-full translation-description">
          <span style={{color: 'green'}}>{t("text_translations.show.guest_description", {languages})}</span>
        </div>
      </div>
      <div className="columns is-centered is-vcentered">
        <div className="column is-full">
          <button className="button is-interpreters-yellow" style={{color: 'black'}} onClick={reset}>{t("text_translations.show.create_new")}</button>
        </div>
      </div>
    </div>
  );
}



function RequestForm({onRequestCreated}) {
  let form = useForm();
  let { attachments } = useDropzoneAttachments();
  let [getQuotes, setGetQuotes] = useState(false)
  let openableFormRef = useRef()

  let submitForm = formData => {
    if (form.formState.isSubmitting) {
      return;
    }

    let body = formData;

    let {isValid, uuids} = validateAttachments(attachments);
    if (isValid) {
      if (uuids) {
        body = Object.assign(body, {attachmentUuids: uuids});
      }

      return fetchJSON
        .post(api.textTranslationRequestsPath(), {body})
        .then(r => {
            window.scrollTo(0, 0)
            onRequestCreated(r.textTranslationRequest);
        });
    } else {
      form.setError("attachmentUuids", "invalid");
    }
  };

  return (
    <FormContext {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="translation-request-form">
      <div className="translation-request-form-box">
        <MainFields openableFormRef={openableFormRef} setGetQuotes={setGetQuotes}/>
        </div>
        <div name="textTranslationForm">
        </div>
          { getQuotes && <AdditionalFields openableFormRef={openableFormRef} getQuotes={getQuotes}/>}
      </form>
    </FormContext>
  );
}
