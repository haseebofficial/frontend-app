export function toStrictBool(val) {
  return !(val === null || val === undefined || val === false);
}

export function strictOr(...values) {
  let result;
  for (let v of values) {
    result = v;
    if (toStrictBool(v)) break;
  }

  return result;
}