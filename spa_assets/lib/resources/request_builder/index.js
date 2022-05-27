import { getConfig } from "config";
import joinPath from "utils/join_path";

const API_BASE    = getConfig("api_base_url");
const API_VERSION = "v1";
const API_URL     = joinPath(API_BASE, API_VERSION);

export const local = {
  get: buildLocalRequest("GET"),
  post: buildLocalRequest("POST"),
  put: buildLocalRequest("PUT"),
  delete: buildLocalRequest("DELETE")
};

export const remote = {
  get: buildRemoteRequest("GET"),
  post: buildRemoteRequest("POST"),
  put: buildRemoteRequest("PUT"),
  delete: buildRemoteRequest("DELETE")
};  

function buildLocalRequest(method) {
  return function(location, data) {
    let headers = {"Content-Type": "application/json; charset=utf-8"};

    let options = { method, headers, credentials: "include" };
    if (method !== "GET") {
      options.body = JSON.stringify(data); // T
    }

    return { location, options };
  };
}

function buildRemoteRequest(method) {
  return function(location, data) {
    location = joinPath(API_URL, location);

    let jwt = window.localStorage.getItem("API_JWT");
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer: ${jwt}`
    };

    let options = { method, headers };
    if (method !== "GET") {
      options.body = JSON.stringify(data); // T
    }

    return { location, options };
  };
}