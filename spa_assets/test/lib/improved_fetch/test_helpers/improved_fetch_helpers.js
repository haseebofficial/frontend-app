import { toSnakeCase } from "utils/string_utils";
import deepTransformObject from "improved_fetch/utils/deep_transform_object";
import objectToFormData from "improved_fetch/utils/object_to_form_data";

export let mockJSON = buildMocker();

["put", "post", "delete", "patch"].forEach(method => {
  mockJSON[method] = buildMocker({method: method});
});

export let mockFormData = buildMocker({transformBody: objectToFormData, method: "POST"});

function buildMocker(config={}) {
  let { method, transformBody } = config;

  return function (matcher, response, options) {
    options = transformRequestBody(options, transformBody);
    options = method ? Object.assign({}, options, {method}) : options;

    response = transformResponse(response);
    fetch.mockOnce(matcher, response, options);
  };
}

function transformRequestBody(options, transform) {
  if (options && options.body) {
    let body = deepTransformObject(options.body, ([k, v]) => [toSnakeCase(k), v]);
    body = transform ? transform(body) : body;
    return Object.assign({}, options, {body});
  } else {
    return options;
  }
}

function transformResponse(response) {
  return deepTransformObject(response, ([k, v]) => [toSnakeCase(k), v]);
}