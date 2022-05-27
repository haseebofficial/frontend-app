import fetchMock from "fetch-mock";
import { normalizeUrl } from "fetch-mock/cjs/lib/request-utils";
import { nextTick } from "test/support/event_loop"; 
import { inspect } from "utils/inspect_utils";
import * as CoreObject from "core_modules/core_object";

let fetch = fetchMock.sandbox();
fetch.config.warnOnFallback = false;

fetch.mockOnce = function(matcher, response, options) {
  let expectedBody = options && options.body;
  if (expectedBody && expectedBody instanceof FormData) {
    delete options.body;
    options.matcher = (url, options) => {
      return normalizeUrl(url) === normalizeUrl(matcher) && isFormDataEqual(expectedBody, options.body);
    };
  }
  return fetch.once(matcher, response, options);
};

fetch.resetAllMocks = function() {
  return fetch.reset();
};

fetch.listUnusedMocks = function() {
  let routes = fetch.routes;
  let unusedMocks = [];

  for (let route of routes) {
    let calls = fetch.calls(route.identifier);

    if (calls.length === 0) {
      unusedMocks.push(route.identifier);
    }
  }

  return unusedMocks;
};

fetch.validateAndResetMocks = function() {
  let unusedMocks = fetch.listUnusedMocks();
  fetch.resetAllMocks();
  if (unusedMocks.length !== 0) {
    throw new Error(`Fetch mock still has some unused mocks defined: ${inspect(unusedMocks)}`);
  }
};

fetch.awaitRequests = async function() {
  await nextTick();
};

export default fetch;

function isFormDataEqual(data_1, data_2) {
  return CoreObject.isEqual(formDataToObject(data_1), formDataToObject(data_2));
}

function formDataToObject(formData) {
  return fromEntries(Array.from(formData.entries()));
}

function fromEntries(entries) {
  let result = {};
  for (let [k, v] of entries) {
    result[k] = v;
  }
  return result;
}