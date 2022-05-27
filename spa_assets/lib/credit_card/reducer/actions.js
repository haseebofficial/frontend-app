const SHOW_CREDIT_CARD_MODAL = "SHOW_CREDIT_CARD_MODAL";
const HIDE_CREDIT_CARD_MODAL = "HIDE_CREDIT_CARD_MODAL";

export let types = { SHOW_CREDIT_CARD_MODAL, HIDE_CREDIT_CARD_MODAL };

export function show() {
  return {type: SHOW_CREDIT_CARD_MODAL};
}

export function hide() {
  return {type: HIDE_CREDIT_CARD_MODAL};
}