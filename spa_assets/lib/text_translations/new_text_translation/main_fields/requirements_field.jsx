import "text_translations/_styles/new_text_translation/main_fields/requirements_field.scss";
import React from "react";
import i18n from "i18n";
import { useFormContext } from "react-hook-form";
import { useDropzoneAttachments } from "text_translations/new_text_translation/attachments_dropzone";
import { removeAttachment } from "form_utils/attachments_uploader";

export default function RequirementsField() {
  let { attachments, getAttachmentInputProps } = useDropzoneAttachments();
  let inputProps = getAttachmentInputProps({testid: "attachment-input", className: "file-input"});

  return (
    <div className="field main-field requirements-field">
      {attachments.length > 0 ? 
        <AttachmentsList inputProps={inputProps}/> :
        <WordCountField inputProps={inputProps}/>
      }
    </div>
  );
}

export function validateAttachments(attachments) {
  if (attachments.length > 0) {
    let isValid = true;
    let uuids = [];
    attachments.forEach(({uploaderResult, isUploaded}) => {
      if (isUploaded) {
        uuids.push(uploaderResult.uuid);
      } else {
        isValid = false;
      }
    });

    return {isValid, uuids};
  } else {
    return {isValid: true, uuids: undefined};
  }
}

function AttachmentsList({inputProps}) {
  let t = i18n.scoped("text_translations.form");

  let { attachments, attachmentsDispatch } = useDropzoneAttachments();
  let remove = (attachment) => () => attachmentsDispatch(removeAttachment(attachment));

  return (
    <React.Fragment>
      <label className="label">{t("attachments.label")}</label>
      <div className="attachments-container" testid="attachments-list">
        <div className="attachments-list">
          {attachments.map((attachment, i) => 
            <Attachment key={i} attachment={attachment} remove={remove}/>
          )}
        </div>
        <label className="add-files-label">
          <input {...inputProps}/>
          <i className="fas fa-2x fa-plus"/>
        </label>
      </div>
    </React.Fragment>
  );
}

function Attachment({attachment, remove}) {
  let name = attachment.file.name;

  return (
    <div className="attachment-item" testid={`attachment-${name}`}>
      <span className="attachment-name">{name}</span>
      {attachment.isUploaded ?
        <span className="remove-attachment has-text-danger" testid={`remove-attachment-${name}`} onClick={remove(attachment)}>
          <i className="fas fa-times"/>
        </span>
        :
        <span className="attachment-loading has-text-grey-lighter">
          <i className="fas fa-spinner fa-spin"/>
        </span>
      }
    </div>
  );
}

function WordCountField({inputProps}) {
  let { register } = useFormContext();
  let t = i18n.scoped("text_translations.form");

  return (
    <React.Fragment>
      <label className="label">{t("word_count")}</label>
      <div className="control">
        <div className="field has-addons">
          <div className="control">
            <input type="text" ref={register} name="wordCount" testid="words-count-input" defaultValue="800" className="input is-fullwidth"/>
          </div>

          <div className="control">
            <div className="file">
              <label className="file-label">
                <input {...inputProps} />
                <span className="file-cta">
                  <span className="file-label">
                    <span className="or">
                      {t("attachments.or")}
                    </span>
                    <span className="label-main-text">
                      {t("attachments.upload")}
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}