import { interpretationCallExternalNumberPath } from "routes";

export function buildAddParticipant(dispatch, fetcher, call) {
  return function(number) {
    if (!call) { return () => {}; }
    return fetcher.fetchApi(interpretationCallExternalNumberPath(call.id), { method: "POST", body: {phone_number: number} })
      .then(() => {
        let thirdParticipant = { state: "connected", phone: number };
        dispatch({type: "TWILIO_UPDATE_THIRD_PARTICIPANT", thirdParticipant, callId: call.id});
      });
  };
}

export function buildRemoveParticipant(fetcher, call) {
  return function() {
    return fetcher.fetchApi(interpretationCallExternalNumberPath(call.id), { method: "DELETE" });
  };
}

export function buildResetCall(dispatch) {
  return function() {
    dispatch({type: "TWILIO_RESET_CALL"});
  };
}

export function buildFinishCall(path) {
  return function() {
    window.location.href = path;
  };
}