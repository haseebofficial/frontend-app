import setFetchDefaults from "fetcher/set_fetch_defaults";
import Response from "./response";
import { isEqual } from "utils/map_utils";

class FetchMock {
  constructor() {
    this.mockedLocations = {};
    this.requestConstraints = {};

    this.fetch = this.fetch.bind(this);
    this.mockOnce = this.mockOnce.bind(this);
  }

  mockOnce({location, response, request}) {
    this.mockedLocations[location] = new Response(response);

    if (request) {
      this.requestConstraints[location] = request;
    }
  }

  fetch(location, data) {
    data = data || {};
    let response = this.mockedLocations[location];
    let requestConstraints = this.requestConstraints[location];
    let checkResult = this.checkConstraints(requestConstraints, data);

    if (response && checkResult.isValid) {
      delete this.mockedLocations[location];
      return Promise.resolve(response);
    } else {
      let isLocationMocked = !!response;
      let message; 

      if (isLocationMocked && !checkResult.isBodyValid) {
        message = `Request was missing required body, expected:` + 
          `${JSON.stringify(requestConstraints.body)}, got: ${data.body}`;
      } else if (isLocationMocked && !checkResult.isMethodValid) {
        message = `Expected request method: ${requestConstraints.method}, got: ${data.method}`;
      } else {
        message = `Location not found: "${location}". You must explicitly mock the response from this location with mockOnce()`;
      }

      throw new FetchLocationNotFoundError(message);
    }
  }

  checkConstraints(constraints, requestData) {
    if (constraints) {
      let isBodyValid = this.isBodyValid(constraints.body, requestData.body);
      let isMethodValid = this.isMethodValid(constraints.method, requestData.method);

      return {isValid: isBodyValid && isMethodValid, isBodyValid, isMethodValid };
    } else {
      return {isValid: true };
    }
  }

  isBodyValid(expected, actual) {
    if (expected === actual) {
      return true;
    } else if (!actual) {
      return false;
    }

    actual = JSON.parse(actual);
    return isEqual(expected, actual);

  }

  isMethodValid(expected, actual) {
    return (expected === actual);
  }
}

class FetchLocationNotFoundError extends Error {}

export default class Fetcher {
  constructor() {
    let apiFetchMock = new FetchMock();
    this.fetchApi = setFetchDefaults({fetch: apiFetchMock.fetch, contentType: "json"}).bind(this);
    this.fetchApi.mockOnce = apiFetchMock.mockOnce;

    let localFetchMock = new FetchMock();
    this.fetchLocal = setFetchDefaults({fetch: localFetchMock.fetch, contentType: "json"}).bind(this);
    this.fetchLocal.mockOnce = localFetchMock.mockOnce;
  }
}