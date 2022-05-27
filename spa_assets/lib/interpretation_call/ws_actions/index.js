
export default function interpretationCallWsActions(notification) {
  let data = notification.data;

  console.log("\n     << debug >>            ws_actions > index.js > interpretationCallWsActions             --------\n",
  "notification.message   > "+  notification.message,
  "\n------------------ end ----------------------------\n")
   
   
  switch(notification.message) {
    case "twilio_conference#conference_started":
      return {type: "TWILIO_UPDATE_DURATION", duration: data.duration, callId: data.call_id};
    case "interpretation_call_payments#updated":
      return {type: "TWILIO_UPDATE_PAYMENT", amount_eur: data.amount_eur, callId: data.call_id};
    case "twilio_conference#participant_joined": 
      if (data.participant.type === "phone") {
        let thirdParticipant = { state: "connected", phone: data.participant.number };
        return {type: "TWILIO_UPDATE_THIRD_PARTICIPANT", thirdParticipant, callId: data.call_id};
      } else if (data.participants_count === 2) {
        return {type: "TWILIO_CONNECT", callId: data.call_id};
      }
      break;
    case "twilio_conference#participant_left":
      if (data.participant.type === "phone") {
        return {type: "TWILIO_UPDATE_THIRD_PARTICIPANT", thirdParticipant: {state: "disconnected"}, callId: data.call_id};
      }
  }
}