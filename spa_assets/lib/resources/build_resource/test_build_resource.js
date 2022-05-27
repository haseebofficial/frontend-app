import httpClient from "../http_client";
import Response from "../http_client/test_response";
import buildResource from "./build_resource";

export default function testBuildResource() {
  let resource = buildResource(...arguments);

  for (let requestName in resource) {
    resource[requestName] = makeMockable(resource[requestName]);
  }

  return resource;
}

function makeMockable(doRequest) {
  doRequest.mockOnce = function(argsOrResponse, responseOrRequestOpts, requestOptsOrNothing) {
    let args;
    let response;
    let requestOpts;

    if (Array.isArray(argsOrResponse)) {
      args = argsOrResponse;
      response = responseOrRequestOpts;
      requestOpts = requestOptsOrNothing;
    } else {
      args = [];
      response = argsOrResponse;
      requestOpts = responseOrRequestOpts;
    }

    let status = requestOpts && requestOpts.status;
    response = new Response({body: response, status});
    
    let { location, options } = doRequest._buildRequest(...args);

    httpClient.mockOnce({location, options, response});
  };

  return doRequest;
}