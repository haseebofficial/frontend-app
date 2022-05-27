import * as CoreObject from "core_modules/core_object";
import * as Enum from "core_modules/enum";

export default function deepTransformObject(object, transform) {
  if (CoreObject.isPlainObject(object)) {
    return Enum.map(object, ([k, v]) => {
      return transform([k, deepTransformObject(v, transform)]);
    });
  } else if (Array.isArray(object)) {
    return Enum.map(object, v => deepTransformObject(v, transform));
  } else {
    return object;
  }
}