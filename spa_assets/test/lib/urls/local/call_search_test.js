import test from "tape";
import { testAppendsQueryStringToUrl } from "test/lib/urls/shared_test_cases";

import { callSearch } from "urls/local";

test("urls/local/call_search", function(t) {
  t.test("createPath", function(t) {
    testAppendsQueryStringToUrl( t, callSearch.createPath );

    t.end();
  });

  t.end();
});