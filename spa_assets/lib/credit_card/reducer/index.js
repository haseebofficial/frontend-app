import { types } from "./actions";

export default function(state, action) {
  state = state || {isShown: false};
  
  switch(action.type) {
    case types.SHOW_CREDIT_CARD_MODAL: {
      return {isShown: true};
    }
    case types.HIDE_CREDIT_CARD_MODAL: {
      return {isShown: false};
    }
  }

  return state;
}