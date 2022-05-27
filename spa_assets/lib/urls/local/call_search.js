import { toQueryString } from "urls/shared";

export default { createPath };

function createPath(query) {
  return `/interpretation_calls/new` + toQueryString(query);
}