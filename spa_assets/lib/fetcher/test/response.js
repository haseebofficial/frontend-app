export default class Response {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }
    
    this.status = this.status || 200;
    this.ok = (this.status >= 200 && this.status < 300) ? true : false;

    this.json = this.json.bind(this);
    this.text = this.text.bind(this);
  }

  json() {
    if (this.bodyUsed) {
      return rejectWithBodyUsed();
    } else {
      this.bodyUsed = true;
      return Promise.resolve(bodyToJson(this.body));
    }
  }

  text() {
    if (this.bodyUsed) {
      return rejectWithBodyUsed();
    } else {
      this.bodyUsed = true;
      return Promise.resolve(bodyToStr(this.body));
    }
  }
}

function bodyToJson(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return body;
  }
}

function bodyToStr(body) {
  if (typeof body === "object") {
    return JSON.stringify(body);
  } else {
    return body;
  }
}

function rejectWithBodyUsed() {
  return Promise.reject(new TypeError("Body has already been consumed."));
}