import buildResource from "./build_resource";
import { remote } from "./request_builder";

export default buildResource({
  create: (amount) => {
    return remote.post("/client_balance_payments", {payment: {amount, currency: "EUR"}});
  } 
});