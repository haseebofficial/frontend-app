export default class Response {
  constructor({status, body}) {
    this._body = body;

    this.status = status || 200;
    this.ok = (this.status >= 200 && this.status < 300) ? true : false;
  }

  json() {
    if (this.bodyUsed) {
      return Promise.reject(new TypeError("Body has already been consumed."));
    } else {
      this.bodyUsed = true;
      return Promise.resolve(this._body);
    }
  }
}