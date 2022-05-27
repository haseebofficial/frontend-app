export function isEmpty(string) {
  return string === "";
}

export function toCamelCase(string) {
  let splits = string.split("_");
  let first = splits[0];
  let rest = splits.slice(1).map(capitalize).join("");
  return first + rest;
}

export function toSnakeCase(string) {
  return string.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}