import { useRef, useEffect } from "react";
import useVisible from "react_utils/use_visible";

export default function useVisibleClickableComponent(isVisible) {
  let visibility = useVisible(isVisible);
  let { hide } = visibility;
  let ref = useRef(null);

  useEffect(() => {
    let handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        hide();
      }
    };

    onDocumentClick(handleClickOutside);
    return () => offDocumentClick(handleClickOutside);
  }, [hide]);

  return {ref, ...visibility};
}

const CLICK_EVENTS = ['click'];

function onDocumentClick(callback) {
  for (let e of CLICK_EVENTS) {
    document.addEventListener(e, callback, true);
  }
}

function offDocumentClick(callback) {
  for (let e of CLICK_EVENTS) {
    document.removeEventListener(e, callback, true);
  }
}