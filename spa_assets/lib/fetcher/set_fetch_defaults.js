import FetchDefaults from "fetcher/fetch_defaults";

export default function setFetchDefaults(params) {
  let fetch = params.fetch;
  let defaults = new FetchDefaults(params);

  return function(location, data) {
    let parsedData = defaults.getData(location, data);

    return fetch(parsedData.location, parsedData.data).then(buildResultWithJson);
  };
}

function buildResultWithJson(response) {
  let promise = parseJSON(response).then((json) => ({ response, json }));

  if (response.ok) {
    return promise;
  } else {
    return promise.then(r => Promise.reject(r));
  }
}

function parseJSON(response) {
  return response.json().catch(() => Promise.resolve({}));
}