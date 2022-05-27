import "text_translations/_styles/new_text_translation/attachments_dropzone.scss";
import React, { useMemo, useCallback, createContext, useContext } from "react";
import i18n from "i18n";
import api from "api_routes";
import { postFormData } from "improved_fetch";
import { useDropzone } from "react-dropzone";
import { useAttachmentsUploader, uploadFiles } from "form_utils/attachments_uploader";

let DropzoneContext = createContext(null);

export default function AttachmentsDropzone({children}) {
  let t = i18n.scoped("text_translations.form");
  let callbacks = useMemo(() => {
    return { uploadFile };
  }, []);
  let [attachments, attachmentsDispatch] = useAttachmentsUploader(callbacks);

  let onDropAccepted = useCallback(files => attachmentsDispatch(uploadFiles(files)), [attachmentsDispatch]);
  let {getRootProps, getInputProps, isDragActive} = useDropzone({onDropAccepted, noClick: true});
  let activityClass = isDragActive ? "drag-active" : "";

  return (
    <div {...getRootProps({className: "attachments-dropzone"})}>
      <div className={ `dropzone-activity-indicator ${activityClass}`}>
        <p>{t("attachments.dropzone_text")}</p>
      </div>
      <DropzoneContext.Provider value={{attachments, attachmentsDispatch, getAttachmentInputProps: getInputProps}}>
        {children}
      </DropzoneContext.Provider>
    </div>
  );
}

export function useDropzoneAttachments() {
  return useContext(DropzoneContext);
}

function uploadFile(file) {
  let endpoint = api.textTranslationAttachmentsPath();
  let request = { body: {file} };
  return postFormData(endpoint, request).then(response => response.attachment);
}
