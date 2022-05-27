import { inspectFunctionCall } from "utils/inspect_utils";

class InvalidRegexpError extends Error {}

export function escapeString(string) {
  let matchOperatorsRegexp = /[|\\{}()[\]^$+*?.-]/g;

  return string.replace(matchOperatorsRegexp, '\\$&');
}

export function listMatches(string, regexp) {
  if (!regexp.global) {
    let funcCall = inspectFunctionCall("listMatches", string, regexp);
    throw new InvalidRegexpError(`Expected a global regexp, but got: ${funcCall}`);
  }

  let result = [];
  let match = regexp.exec(string);

  while (match != null) {
    result.push(match);
    match = regexp.exec(string);
  }

  return result;
}