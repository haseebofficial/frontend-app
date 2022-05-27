import httpClient from "../http_client";

export default function buildResource(requests) {
  let result = {};

  for (let requestName in requests) {
    let buildRequest = requests[requestName];

    let doRequest = function() {
      let request = buildRequest(...arguments);

      return httpClient(request.location, request.options).then(parseResponse);
    };

    doRequest._buildRequest = buildRequest;

    result[requestName] = doRequest;
  }

  return result;
}

function parseResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then((body) => Promise.reject({error: response.status, body}));
  }
}