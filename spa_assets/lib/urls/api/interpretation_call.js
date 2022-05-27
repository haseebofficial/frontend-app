import { objectToId, toQueryString } from "urls/shared";

const externalNumbers = {};

export default { externalNumbers, showUrl };

externalNumbers.createUrl = function(call, query) {
  return `/interpretation_calls/${objectToId(call)}/external_number` + toQueryString(query);
};

externalNumbers.deleteUrl = function(call) {
  return `/interpretation_calls/${objectToId(call)}/external_number`;
};

function showUrl(call, query) {
  return `/interpretation_calls/${objectToId(call)}` + toQueryString(query);
}