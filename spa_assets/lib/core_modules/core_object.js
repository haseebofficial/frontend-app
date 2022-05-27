import lodashIsPlain from "lodash/isPlainObject";
import lodashIsEqual from "lodash/isEqual";

export function get(obj, key, defaultValue) {
  let value = obj[key];
  return value === undefined ? defaultValue : value;
}

export function hasKey(obj, key) {
  return obj.hasOwnProperty(key);
}

export function put(obj, key, value) {
  return {...obj, [key]: value};
}

export function isPlainObject(value) {
  return lodashIsPlain(value);
}

export function isEqual(obj_1, obj_2) {
  return lodashIsEqual(obj_1, obj_2);
}