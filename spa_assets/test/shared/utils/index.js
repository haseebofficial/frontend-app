export function strict(target) {
  return _makeStrictObject(target, {originator: target, callChain: []});
}

function _makeStrictObject(target, {originator, callChain}) {
  target = Object.assign({}, target);
  
  makeNestedObjectsStrict(target, {originator, callChain});

  let get = buildGet({originator, callChain});
  return new Proxy(target, {get});
}

function makeNestedObjectsStrict(obj, {originator, callChain}) {
  for (let key in obj) {
    let value = obj[key];
    
    if (typeof value === "object") {
      obj[key] = _makeStrictObject(value, {originator, callChain: [...callChain, key]});
    }
  }
}

class KeyError extends Error {}
function buildGet({originator, callChain}) {
  return function get(obj, prop) {
    if (prop in obj || prop === 'then') {
      return obj[prop];
    } else {
      let keyChain = [...callChain, prop].join(".");
      throw new KeyError(`Key "${keyChain}" not found in strict object ${JSON.stringify(originator)}`);
    }
  };
}