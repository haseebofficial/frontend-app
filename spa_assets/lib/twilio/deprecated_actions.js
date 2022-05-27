export function buildConnect(dispatch, call) {
  return function({onFinish}) {
    dispatch({ type: "REQUEST_TWILIO_CONNECT", call });
    onFinish && onFinish();
  };
}

export function buildDisconnect(dispatch) {
  return function () {
    dispatch({ type: "REQUEST_TWILIO_DISCONNECT" });
  };
}

export function buildToggleMute(dispatch) {
  return function (isMuted) {
    dispatch({ type: "REQUEST_TWILIO_TOGGLE_MUTE", isMuted });
  };
}