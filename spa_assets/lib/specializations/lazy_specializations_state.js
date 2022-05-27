import describeState from "redux-describe-state";
import { useSelector, useDispatch } from "react-redux";
import { initialState, ensureStateLoaded } from "new_store/lazy_state";
import { fetchJSON } from "improved_fetch";
import api from "api_routes";

let specializationsState = describeState({
  name: "lazySpecializations", 
  getInitialState: () => initialState([])
});

export default specializationsState;

export function useLazySpecializations() {
  let dispatch = useDispatch();
  dispatch(ensureSpecializationsLoaded());
  return useSelector(state => state.lazySpecializations);
}

export function ensureSpecializationsLoaded() {
  return ensureStateLoaded(specializationsState, loadSpecializations);
}

function loadSpecializations() {
  return fetchJSON(api.specializationsPath()).then(response => response.specializations);
}