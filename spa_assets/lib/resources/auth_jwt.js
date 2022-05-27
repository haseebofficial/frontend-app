import buildResource from "./build_resource";
import { local, remote } from "./request_builder";

export default buildResource({
  find: (_is_newFE=false) => {
    if(_is_newFE) 
      return remote.post("/users/sessions?refresh_jwt=true")
    else 
      return local.get("/jwt?refresh_jwt=true");
  }
});