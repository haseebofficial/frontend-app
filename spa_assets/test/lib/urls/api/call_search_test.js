import test from "tape";
import { callSearch } from "urls/api";
import { testBuildsUrlWithIdFromIntAndObject, testAppendsQueryStringToUrl } from "test/lib/urls/shared_test_cases";

test("urls/api/call_search availableInterpreters.indexUrl", function(t) {
  let url = callSearch.availableInterpreters.indexUrl;

  testBuildsUrlWithIdFromIntAndObject(t, url);
  testAppendsQueryStringToUrl(t, (q) => url(1, q));
  
  t.end();
});