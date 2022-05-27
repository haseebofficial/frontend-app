import { buildQueries, queries, render as testingLibRender, getQueriesForElement } from '@testing-library/react';
export * from '@testing-library/react';

let tagQueries = assembleQueries({
  name: "Tag",
  queryAllBy: (container, tag) => container.getElementsByTagName(tag),
  getMultipleError: (c, tag) => `Found multiple elements with tag: ${tag}`,
  getMissingError: (c, tag) => `Unable to find an element with tag: ${tag}`
});

let nameQueries = assembleQueries({
  name: "Name",
  queryAllBy: (container, name) => container.querySelectorAll(`[name=${name}]`),
  getMultipleError: (c, name) => `Found multiple elements with name: ${name}`,
  getMissingError: (c, name) => `Unable to find an element with name: ${name}`
});

let customQueries = {...tagQueries, ...nameQueries};

export function render(ui, options) {
  let allQueries = { ...queries, ...customQueries};
  return testingLibRender(ui, {queries: allQueries, ...options});
}

export function within(element) {
  return getQueriesForElement(element, {...queries, ...customQueries});
}

function assembleQueries({name, queryAllBy, getMultipleError, getMissingError}) {
  let [
    queryBy,
    getAllBy,
    getBy,
    findAllBy,
    findBy,
  ] = buildQueries(queryAllBy, getMultipleError, getMissingError);

  return {
    [`queryAllBy${name}`]: queryAllBy,
    [`queryBy${name}`]: queryBy,
    [`getAllBy${name}`]: getAllBy,
    [`getBy${name}`]: getBy,
    [`findAllBy${name}`]: findAllBy,
    [`findBy${name}`]: findBy
  };
}