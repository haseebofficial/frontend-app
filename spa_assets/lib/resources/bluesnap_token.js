import buildResource from "./build_resource";
import { remote } from "./request_builder";

export default buildResource({
  create: () => {
    return remote.post("/bluesnap_tokens");
  } 
});