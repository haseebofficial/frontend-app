export default { twilioCall, twilioCallRequest };

export function requestConnect(call) {
  return { type: "REQUEST_TWILIO_CONNECT", call };
}

export function requestDisconnect() {
  return { type: "REQUEST_TWILIO_DISCONNECT" };
}

export function requestToggleMuted(isMuted) {
  return { type: "REQUEST_TWILIO_TOGGLE_MUTE", isMuted };
}

export function updateCurrentCall(call) {
  return { type: "TWILIO_UPDATE_CURRENT_CALL", call };
}

export function ringing() {
  return { type: "TWILIO_RINGING" };
}

export function disconnect() {
  return { type: "TWILIO_DISCONNECT" };
}

export function toggleMuted(isMuted) {
  return { type: "TWILIO_TOGGLE_MUTE", isMuted };
}

export function requestSupportCallConnect() {
  return { type: "REQUEST_TWILIO_SUPPORT_CALL" };
}

export function reset() {
  return { type: "TWILIO_RESET_CALL" };
}

export function twilioCallRequest(twilioCallRequest, action) {

  twilioCallRequest = twilioCallRequest || {isMuted: false};
  switch (action.type) {
    case "REQUEST_TWILIO_CONNECT": {
      return Object.assign({}, twilioCallRequest, {state: "connect_requested", call: action.call });
    }
    case "REQUEST_TWILIO_SUPPORT_CALL": {
      return Object.assign({}, twilioCallRequest, {state: "connect_requested", call_type: "support_call" });
    }
    case "REQUEST_TWILIO_DISCONNECT": 
      return Object.assign({}, twilioCallRequest, {state: "disconnect_requested"});
    case "REQUEST_TWILIO_TOGGLE_MUTE": 
      return Object.assign({}, twilioCallRequest, {isMuted: action.isMuted, state: "toggle_mute_requested"});
    case "REQUEST_TWILIO_INCOMING_CALL":
      return Object.assign({}, twilioCallRequest, {state: "incoming_call", incomingCall: action.call});
    default:
      return twilioCallRequest;
  }
}

export function twilioCall(twilioCall, action) {

  twilioCall = twilioCall || defaultTwilioCall();

  switch (action.type) {
    case "TWILIO_CONNECT":
      if (isCurrentCall(twilioCall, action)) {
        return Object.assign({}, twilioCall, {state: "connected"});
      } else {
        return twilioCall;
      }
    case "TWILIO_RINGING":
      return Object.assign({}, twilioCall, {state: "ringing"});
    case "TWILIO_DISCONNECT": {
      return Object.assign({}, twilioCall, {state: "finished"});
    }
    case "TWILIO_TOGGLE_MUTE":
      return Object.assign({}, twilioCall, {isMuted: action.isMuted});
    case "TWILIO_UPDATE_THIRD_PARTICIPANT":{
      if (isCurrentCall(twilioCall, action)) {
        return Object.assign({}, twilioCall, {thirdParticipant: action.thirdParticipant});
      } else {
        return twilioCall;
      }
    }
    case "TWILIO_UPDATE_CURRENT_CALL":{
      return Object.assign({}, twilioCall, {call: action.call});
    }
    case "TWILIO_UPDATE_DURATION": {
      if (isCurrentCall(twilioCall, action)) {
        let call = Object.assign({}, twilioCall.call, {duration: action.duration});
        return Object.assign({}, twilioCall, {call});
      } else {
        return twilioCall;
      }
    }
    case "TWILIO_UPDATE_PAYMENT": {
      if (isCurrentCall(twilioCall, action)) {
        let payment = twilioCall.call.payment || {};
        payment = Object.assign({}, payment, {amount_eur: action.amount_eur});
        let call = Object.assign({}, twilioCall.call, {payment});

        return Object.assign({}, twilioCall, {call});
      } else {
        return twilioCall;
      }
    }
    case "TWILIO_RESET_CALL": 
      return Object.assign({}, twilioCall, defaultTwilioCall());
    default:
      return twilioCall;
  }
}

function defaultTwilioCall() {
  return { isMuted: false, state: "disconnected", thirdParticipant: {state: "disconnected"} };
}

function isCurrentCall(call, action) {
  return call.call.id === action.callId;
}