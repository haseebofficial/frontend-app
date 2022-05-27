import { rejectIf, addRequestOptions, transformResponse, transformRequestBody } from "improve-fetch";
import { toCamelCase, toSnakeCase } from "utils/string_utils";
import deepTransformObject from "./utils/deep_transform_object";
import objectToFormData from "./utils/object_to_form_data";

let globalFetch = fetch;

function buildBaseFetch(opts={}) {
  opts = Object.assign({camelizeResponseKeys: true}, opts);

  let doTransformRequestBody = body => {
    body = deepTransformObject(body, ([k, v]) => [toSnakeCase(k), v]);
    return opts.transformRequestBody ? opts.transformRequestBody(body) : body;
  };

  let doTransformResponse = r => {
    return r.json().then(json => {
      if (opts.camelizeResponseKeys) {
        return deepTransformObject(json, ([k, v]) => [toCamelCase(k), v]);
      } else {
        return json;
      }
    });
  };

  return (
    transformResponse(doTransformResponse,
      transformRequestBody(doTransformRequestBody,
        addRequestOptions({credentials: "include"},
          rejectIf(r => r.status !== 200, globalFetch)
        )
      )
    )
  );
}

export function buildFetchJSON(opts={}) {
  opts = Object.assign(opts, {transformRequestBody: (b) => JSON.stringify(b)});
  return (
    addRequestOptions({headers: {'Content-Type': "application/json"}},
      buildBaseFetch(opts)
    )
  );
}

let fetchJSON = buildFetchJSON();
["put", "post", "delete", "patch"].forEach(method => {
  fetchJSON[method] = addRequestOptions({method: method.toUpperCase()}, fetchJSON);
});
export { fetchJSON };

export let postFormData = (
  addRequestOptions({method: "POST"},
    buildBaseFetch({
      transformRequestBody: (b) => objectToFormData(b)
    })
  )
);
