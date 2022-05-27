import buildResource from "./build_resource";
import { remote } from "./request_builder";

export default buildResource({
  find: () => {
    return remote.get("/credit_card");
  },
  create: (pf_token) => {
    return remote.post("/credit_card", {pf_token});
  },
  remove: () => {
    return remote.delete("/credit_card");
  }
});