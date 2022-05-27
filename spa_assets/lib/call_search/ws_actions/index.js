import { addOffer } from "call_search/reducer/actions";

export default function callSearchWsActions(notification) {
  let data = notification.data;
  
  switch(notification.message) {
    case "call_requests#confirmed": 
      return addOffer({offer: data.interpreter, id: data.search_id});
  }
}