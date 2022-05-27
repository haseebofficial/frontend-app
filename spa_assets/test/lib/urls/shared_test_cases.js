import { toQueryString } from "urls/shared";

export function testBuildsUrlWithIdFromIntAndObject(t, buildUrl) {
  let id = 384;
  let item = {id};
  let str = `/${id}`;

  t.true(buildUrl(id).includes(str), "inserts item if typeof item === number");
  t.true(buildUrl(item).includes(str), "inserts item.id if typeof item !== number");
}

export function testAppendsQueryStringToUrl(t, buildUrl) {
  let query = {a: "?&+-=", b: 123};
  let str = toQueryString(query);

  t.true(buildUrl(query).includes(str), "appends correct query string to resulting url");
}