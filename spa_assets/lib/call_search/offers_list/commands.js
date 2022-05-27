import { interpretationCallsPath, local } from "routes";
import { show } from "credit_card/reducer/actions";

export function buildCreateCall({callData, dispatch, fetcher, window, i18n}) {
  return function() {
    let body = {call_search_id: callData.searchId, interpreter_id: callData.interpreterId, user_agent: "web"};
    
    return fetcher.fetchApi(interpretationCallsPath(), {body: body, method: "POST"})
      .then(redirectToCall, handleError);

    function handleError({json}) {
      if (json.error_info.type === "missing_credit_card") {
        dispatch(show());
      } else if (json.error_info.type === "unpaid_calls") {
        window.alert(i18n.t("call_search.offers_list.unpaid_calls_alert"));
      }
    }

    function redirectToCall({json}) {
      window.location.href = local.interpretationCallPath(json.interpretation_call.id);
    }
  };
}