import describeState from "redux-describe-state";
import { initialState, ensureStateLoaded } from "new_store/lazy_state";
import { fetchJSON } from "improved_fetch";
import { useSelector, useDispatch } from "react-redux";
import api from "api_routes";

let languagesState = describeState({
  name: "lazyLanguages", 
  getInitialState: () => initialState([])
});

export default languagesState;

export function useLazyLanguages() {
  let dispatch = useDispatch();
  dispatch(ensureLanguagesLoaded());
  return useSelector(state => state.lazyLanguages);
}

export function ensureLanguagesLoaded() {
  return ensureStateLoaded(languagesState, loadLanguages);
}

function loadLanguages() {
  return fetchJSON(api.languagesPath()).then(response => response.languages);
}