const ADD_OFFERS_LIST = "ADD_OFFERS_LIST";
const ADD_OFFER = "ADD_OFFER";
const SET_CURRENT_CALL_SEARCH = "SET_CURRENT_CALL_SEARCH";

export let types = { ADD_OFFERS_LIST, ADD_OFFER, SET_CURRENT_CALL_SEARCH };

export function addOffersList({id, offers}) {
  return { type: ADD_OFFERS_LIST, offers, id };
}

export function addOffer({id, offer}) {
  return { type: ADD_OFFER, offer, id };
}

export function setCurrentSearch(callSearch) {
  return { type: SET_CURRENT_CALL_SEARCH, callSearch };
}