import test from "tape";

import reduce from "call_search/reducer";
import { addOffer, addOffersList } from "call_search/reducer/actions";

test("call_search/reducer", function(t) {
  t.test("default state", function(t) {
    t.same(reduce(undefined, {}), {}, "returns empty object");

    t.end();
  });

  t.test("with unrecognized action", function(t) {
    let searches = reduce(undefined, {});
    t.equal(reduce(searches, {}), searches, "returns same object");

    t.end();
  });

  t.test("addOffersList action without search in state", function(t) {
    let searches = reduce(undefined, addOffersList({id: 1, offers: [1, 2, 3]}));

    t.same(searches, {1: {offers: [1, 2, 3]}}, "adds offers to search.offers list");

    t.end();
  });

  t.test("addOffersList action with search already in state", function(t) {
    let action = (id) => addOffersList({id, offers: [1, 2]});
    let oldSearches = reduce(undefined, action(1));
    let newSearches = reduce(oldSearches, action(1));

    t.same(newSearches[1], {offers: [1, 2, 1, 2]}, "adds offers to the list");

    testThreatsAllObjectsAsImmutable(t, action);

    t.end();
  });

  t.test("addOffer action without search in state", function(t) {
    let searches = reduce(undefined, addOffer({id: 1, offer: 1}));

    t.same(searches, {1: {offers: [1]}}, "adds offer to search.offers list");

    t.end();
  });

  t.test("addOfer action with search already in state", function(t) {
    let action = (id) => addOffer({id, offer: 1});

    let oldSearches = reduce(undefined, action(1));
    let newSearches = reduce(oldSearches, action(1));
    t.same(newSearches[1], {offers: [1, 1]}, "adds offer to the list");

    testThreatsAllObjectsAsImmutable(t, action);

    t.end();
  });

  t.end();
});

function testThreatsAllObjectsAsImmutable(t, action) {
  let oldSearches = { 1: {offers: [1, 2, 3]}, 2: "search#2"};
  let newSearches = reduce(oldSearches, action(1));

  t.notEqual(oldSearches, newSearches, "returns new searches object");
  t.notEqual(newSearches[1], oldSearches[1], "returns new search object");
  t.notEqual(newSearches[1].offers, oldSearches[1].offers, "returns new offers object");
  t.equal(newSearches[2], "search#2", "keeps old searches in place");
}