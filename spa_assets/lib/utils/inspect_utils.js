import * as objectUtils from "utils/object_utils";

export function inspectFunctionCall(func, ...args) {
  let inspectedArgs = args.map(a => inspect(a)).join(", ");

  return `${func}(${inspectedArgs})`;
}

export function inspect(value) {
  switch(typeof value) {
    case 'string': {
      return `"${value}"`;
    }
    case "undefined": {
      return "undefined";
    }
    case "object": {
      return inspectObject(value);
    }
    default: {
      return value;
    }
  }
}

function inspectObject(obj) {
  if (obj === null) {
    return "null";
  } else if (Array.isArray(obj)) {
    let presentedArray = obj.map(inspect);

    return "[" + presentedArray.join(", ") + "]";
  } else if (objectUtils.isPlainObject(obj)) {
    return inspectPlainObject(obj);
  } else {
    return typeof obj.inspect === "function" ? obj.inspect() : obj.toString();
  }
}

function inspectPlainObject(obj) {
  let result = [];

  for (let [key, value] of Object.entries(obj)) {
    let presentedEntry = `${key}: ${inspect(value)}`;
    result.push(presentedEntry);
  }

  let leftBracket = "{";
  let rightBracket = "}";

  if (result.length != 0) {
    leftBracket = leftBracket + " ";
    rightBracket = " " + rightBracket;
  }

  return leftBracket + result.join(", ") + rightBracket;
}