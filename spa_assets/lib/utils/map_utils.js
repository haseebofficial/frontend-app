export function isEqual(object1, object2) {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }

  return Object.keys(object1).every((k) => {
    return compareValues(object1[k], object2[k]);
  });
}

export function isIncludes(whole, part) {
  return Object.keys(part).every((k) => {
    return compareValues(part[k], whole[k]);
  });
}

export function isEmpty(object) {
  return isEqual(object, {});
}

function compareValues(val1, val2) {
  if (typeof val1 === 'object' && typeof val2 === 'object') {
    return isEqual(val1, val2);
  } else {
    return val1 === val2;
  }
}