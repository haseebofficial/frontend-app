import { types } from "./actions";

export default function(popupState, action) {
  popupState = popupState || {displayPopup: false, amount: 0};
  
  switch(action.type) {
    case types.SHOW_PAYMENT_POPUP: {
      popupState = Object.assign({}, popupState, {displayPopup: true, notEnoughFunds: action.notEnoughFunds});
      break;
    }
    case types.HIDE_PAYMENT_POPUP: {
      popupState = Object.assign({}, popupState, {displayPopup: false});
      break;
    }
    case types.UPDATE_BALANCE_AMOUNT: {
      popupState = Object.assign({}, popupState, { amount: action.amount});
      break;
    }
  }

  return popupState;
}