import { validToken, storeToken } from "test/lib/utils/cacheable_jwt/jwt_helpers";
export { validToken } from "test/lib/utils/cacheable_jwt/jwt_helpers";

export function storeValidToken() {
  return storeToken("API_JWT", validToken());
}