export function find(enumerable, predicate) {
  if (Array.isArray(enumerable)) {
    return enumerable.find(i => predicate(i));
  } else {
    return findInObject(enumerable, predicate);
  }
}

function findInObject(obj, predicate) {
  let result;
  for (let key in obj) {
    let value = obj[key];
    let item = [key, value];

    if (predicate(item)) {
      result = item;
      break;
    }
  }
  return result;
}

export function map(enumerable, fun) {
  if (Array.isArray(enumerable)) {
    return enumerable.map(fun);
  } else {
    let result = {};
    for (let key in enumerable) {
      let value = enumerable[key];
      let [newKey, newValue] = fun([key, value]);
      result[newKey] = newValue;
    }
    return result;
  }
}