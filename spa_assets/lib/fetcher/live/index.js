import { getConfig } from "config";
import joinPath from "utils/join_path";

import setFetchDefaults from "fetcher/set_fetch_defaults";

const API_BASE    = getConfig("api_base_url");
const API_VERSION = "v1";
const API_URL     = joinPath(API_BASE, API_VERSION);

export default class Fetcher {
  constructor() {
    this.headers = this.headers.bind(this);
    this.getApiJWT = this.getApiJWT.bind(this);

    this.fetchApi = setFetchDefaults({ host: API_URL, headers: this.headers, fetch, contentType: "json" });
    this.fetchLocal = setFetchDefaults({ credentials: "include", fetch, contentType: "json" });
  }

  headers() {
    return { "Authorization": "Bearer: " + this.getApiJWT() };
  }

  getApiJWT() {
    this.apiJWT = this.apiJWT || window.localStorage.getItem("API_JWT");
    return this.apiJWT;
  }
}