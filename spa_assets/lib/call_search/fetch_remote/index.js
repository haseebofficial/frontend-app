import { callSearchAvailableInterpretersPath } from "routes";
import { addOffersList } from "call_search/reducer/actions";

export function fetchOffers({searchId, fetcher, dispatch}) {
  return fetcher.fetchApi(callSearchAvailableInterpretersPath(searchId))
    .then(({json}) => {
      dispatch(addOffersList({id: searchId, offers: json.interpreters}));
    });
}