import "modal/_styles/modal.scss";
import React, { useEffect, createContext, useContext } from "react";
import useVisibleClickableComponent from "react_utils/use_visible_clickable_component";

export default function useModal(initialState) {
  let modal = useVisibleClickableComponent(initialState);
  let { isVisible, hide } = modal;

  useEffect(() => {
    toggleClippedHtml(isVisible);
  }, [isVisible]);

  useEffect(() => () => {
    toggleClippedHtml(false);
  });

  useEffect(() => {  
    let hideModalOnEsc = (e) => {
      if (e.key === "Escape") hide();
    };

    document.addEventListener('keydown', hideModalOnEsc, true);
    return () => document.removeEventListener('keydown', hideModalOnEsc, true);
  }, [hide]);

  return modal;
}

const CONTEXT = createContext(null);

export function ModalContext({children, modal}) {
  return <CONTEXT.Provider value={modal}>{children}</CONTEXT.Provider>;
}

export function useModalContext() {
  return useContext(CONTEXT);
}

function toggleClippedHtml(isModalShown) {
  if (isModalShown) {
    document.documentElement.classList.add("is-clipped");
  } else {
    document.documentElement.classList.remove("is-clipped");
  }
}