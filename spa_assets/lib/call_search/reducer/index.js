import { types } from "./actions";

export default function(searches, action) {
  searches = searches || {};

  switch (action.type) {
    case types.ADD_OFFERS_LIST: {
      let newOffers = action.offers;
      
      return addToOffersList({searches, newOffers, id: action.id});
    }
    case types.ADD_OFFER: {
      let newOffers = [action.offer];

      return addToOffersList({searches, newOffers, id: action.id});
    }
    case types.SET_CURRENT_CALL_SEARCH: {
      return Object.assign({}, searches, {current: action.callSearch});
    }
    default: {
      return searches;
    }
  }
}

function addToOffersList({searches, newOffers, id}) {
  let search = searches[id];

  if (search) {
    let offers = [...search.offers, ...newOffers];
    search = Object.assign({}, search, {offers});
  } else {
    search = { offers: newOffers };
  }
  
  return Object.assign({}, searches, {[id]: search});
}