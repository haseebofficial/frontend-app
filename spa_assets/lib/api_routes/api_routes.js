import { composeRoutes } from "broutes";
import { getConfig } from "config";

let host = getConfig("apiRoutesHost");

export default composeRoutes(r => {
  r.scope(host, r => {
    r.scope("/api/v2", r => {
      r.route("/users/session", {name: "userSession"});
      r.route("/languages");
      r.route("/specializations");
      r.route("/client_reviews");

      r.route("/text_translation_requests");
      r.scope("/text_translations", r => {
        r.resources("/attachments", {only: ["index", "show"]});
      }, {name: "textTranslation"});
    });
  });
});