export default function supportCallWsActions(notification) {
  let data = notification.data;
  
  switch(notification.message) {
    case "support_calls#updated":
      return { type: "TWILIO_UPDATE_CURRENT_CALL", call: data.call };
  }
}