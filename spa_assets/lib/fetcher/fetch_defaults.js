import joinPath from "utils/join_path";

export default class FetchDefaults {
  constructor(params) {
    if (params) {
      this._host = params.host;
      this._credentials = params.credentials;
      this._headers = params.headers;
      this._contentType = params.contentType;
    }
  }

  getData(location, data) {
    data = Object.assign({}, data);

    if (this._host) {
      location = joinPath(this._host, location);
    }

    if (this._credentials) {
      data.credentials = this._credentials;
    }

    if (this._headers) {
      let headersObj = typeof this._headers === "function" ? this._headers() : this._headers;
      data.headers = Object.assign({}, data.headers, headersObj);
    }

    if (this._contentType) {
      data.headers = Object.assign({}, data.headers, {"Content-Type": "application/json; charset=utf-8"});
    }

    if (typeof data.body === "object") {
      data.body = JSON.stringify(data.body);
    }


    return {location, data};
  }
}