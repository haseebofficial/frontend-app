import buildResource from "./build_resource";
import { remote } from "./request_builder";

export default buildResource({
  find: () => {
    return remote.get("/twilio_token");
  }
});