import CacheableJwt from "utils/cacheable_jwt";
import AuthJwt from "../resources/auth_jwt";

export default async function getToken(_is_newFE=false) {
  return CacheableJwt.get("API_JWT",async ()=>{ return fetchNewToken(_is_newFE)});
}

function fetchNewToken(_is_newFE=false) {
  return AuthJwt.find(_is_newFE).then(json => json.jwt);
}