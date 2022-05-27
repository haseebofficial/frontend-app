let ACTION_TYPE = "SUPPORT_CALL_MODAL";

export default function supportCallModalReducer(modal, action) {
  modal = modal || {isShown: false};

  if (action.type === ACTION_TYPE) {
    modal = action.execute(modal);
  }
  return modal;
}

export function showSupportCallModal() {
  return {type: ACTION_TYPE, execute: doShowModal};
}

function doShowModal() {
  return {isShown: true};
}

export function hideSupportCallModal() {
  return {type: ACTION_TYPE, execute: doHideModal};
}

function doHideModal() {
  return {isShown: false};
}