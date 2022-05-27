import { isEqual } from "utils/map_utils";

export default function testHttpClient(location, options) {
  let response = getAndRemoveResponse(testHttpClient.mockedRequests, {location, options});

  if (response) {
    return Promise.resolve(response);
  } else {
    let optionsText = options.body ? ` with ${options.body}` : '';
    throw `Resource not found: ${options.method} ${location}` + optionsText;
  }
}

testHttpClient.mockedRequests = [];

testHttpClient.mockOnce = function({location, options, response}) {
  testHttpClient.mockedRequests.push({location, options, response});
};

testHttpClient.validateAllMocksUsed = function() {
  if (testHttpClient.mockedRequests.length !== 0) {
    throw `Not all mocked locations were used, remaining: ${JSON.stringify(testHttpClient.mockedRequests)}`;
  }
};

function getAndRemoveResponse(array, {location, options}) {
  let result;

  for (let i in array) {
    let item = array[i];
    
    if (isEqual(item.location, location) && isEqual(item.options, options)) {
      result = item.response;
      array.splice(i, 1);
      break;
    }
  }

  return result;
}