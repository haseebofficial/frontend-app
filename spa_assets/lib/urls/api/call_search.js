import { objectToId, toQueryString } from "urls/shared";

const availableInterpreters = {};

export default { availableInterpreters };

availableInterpreters.indexUrl = function(search, query) {
  return `/call_searches/${objectToId(search)}/available_interpreters` + toQueryString(query);
};