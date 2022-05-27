export function objectToId(object) {
  if (typeof object === "number") {
    return object;
  } else if (typeof object === "string") {
    return parseInt(object);
  } else {
    return object.id;
  }
}

export function toQueryString(object) {
  if (!object) {
    return "";
  } else {
    let query = Object.keys(object).map(key => {
      let value = encodeURIComponent(object[key]);
      return `${key}=${value}`;
    }).join("&");
  
    return `?${query}`;
  }
}