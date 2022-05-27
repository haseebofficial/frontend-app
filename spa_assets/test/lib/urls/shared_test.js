import test from "tape";
import { objectToId, toQueryString } from "urls/shared";

test("urls/shared objectToId", function(t) {
  let id = 195;
  let item = {id};

  t.equal(objectToId(id), id, "returns item if typeof item === number");
  t.equal(objectToId(item), id,  "returns item.id if typeof item !== number");
  t.equal(objectToId("123"), 123, "converts strings to number");

  t.end();
});

test("urls/shared toQueryString", function(t) {
  t.equal(toQueryString({a: 1}), "?a=1", "encodes objects with 1 item");
  t.equal(toQueryString({a: 1, b: 2}), "?a=1&b=2", "encodes objects with multiple items");

  let obj = {a: "?&+-="};
  t.equal(toQueryString(obj), `?a=${encodeURIComponent(obj.a)}`, "uses encodeURIComponent");

  t.equal(toQueryString(undefined), "", "returns empty string if query is undefined");

  t.end();
});