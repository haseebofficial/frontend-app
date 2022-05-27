import { useState, useCallback } from "react";

export function useAttachmentsUploader(callbacks) {
  let [attachmentsState, setState] = useState([]);
  let dispatch = useCallback(action => {
    return setState(state => action(state, setState, callbacks));
  }, [callbacks]);

  return [attachmentsState, dispatch];
}

export function uploadFiles(files) {
  return function(attachmentsState, setState, callbacks) {
    let attachments = files.map(file => {
      let attachment = buildPendingAttachment(file);
      uploadAttachment(attachment, setState, callbacks);
      return attachment;
    });

    return [...attachmentsState, ...attachments];
  };
}

function uploadAttachment(pendingAttachment, setState, callbacks) {
  callbacks.uploadFile(pendingAttachment.file).then(
    (uploaderResult) => {
      setState(attachmentsState => {
        return attachmentsState.map(attachment => {
          if (attachment === pendingAttachment) {
            return buildUploadedAttachment(pendingAttachment, uploaderResult);
          } else {
            return attachment;
          }
        });
      });
    }, 
    () => {
      setState(removeAttachment(pendingAttachment));
    }
  );
}

export function removeAttachment(attachment) {
  return function(attachmentsState) {
    return attachmentsState.filter(a => attachment !== a);
  };
}

function buildPendingAttachment(file) {
  return { file, isUploaded: false };
}

function buildUploadedAttachment(pendingAttachment, uploaderResult) {
  return { file: pendingAttachment.file, isUploaded: true, uploaderResult };
}