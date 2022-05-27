export default function present(call) {
  if (!call) { return {}; }
  
  let { id, interpreter } = call;
  let paymentAmountEur = call.payment ? call.payment.amount_eur : 0; 

  return {
    id,
    interpreterName: getInterpreterName(interpreter),
    interpreterPhoto: (interpreter && interpreter.photo_url),
    duration: call.duration,
    paymentAmountEur
  };
}

function getInterpreterName(interpreter) {
  if (interpreter) {
    return interpreter.name;
  } else {
    return "Interpreter";
  }
}