import test from "tape";
import { buildSpyOnce } from "test/shared/mocks";
import Fetcher from "fetcher";

import { addOffersList } from "call_search/reducer/actions";
import { fetchOffers } from "call_search/fetch_remote";
import { callSearchAvailableInterpretersPath } from "routes";
import { failTestOnReject } from "test/shared/promises";

test("call_search/fetch_remote fetchOffers", function(t) {
  t.test("with success response", function(t) {
    let dispatch = buildSpyOnce();
    let fetcher = new Fetcher();

    let {searchId, offers} = { searchId: 12, offers: [1, 2, 3] };

    fetcher.fetchApi.mockOnce({
      location: callSearchAvailableInterpretersPath(searchId), 
      response: {body: {interpreters: offers}}
    });

    let expectedAction = addOffersList({id: searchId, offers});

    fetchOffers({fetcher, dispatch, searchId})
      .then(() => t.same(dispatch.calledWith, [expectedAction], "calls dispatch with correct action"), failTestOnReject(t))
      .finally(() => t.end());
  });
  
  t.end();
});