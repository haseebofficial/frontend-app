export function toObject(array, getKeyValue) {
  let result = {};

  for (let k of array) {
    let [key, value] = getKeyValue(k);
    result[key] =  value;
  } 

  return result;
}