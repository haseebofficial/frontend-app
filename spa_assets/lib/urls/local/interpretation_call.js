import { toQueryString, objectToId } from "urls/shared";

export default { completePath };

function completePath(call, query) {
  return `/interpretation_calls/${objectToId(call)}/complete` + toQueryString(query);
}