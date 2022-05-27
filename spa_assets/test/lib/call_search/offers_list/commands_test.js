import test from "tape";

import { interpretationCallsPath, local } from "routes";
import Fetcher from "fetcher";
import { failTestOnReject } from "test/shared/promises";
// import { buildSpyOnce } from "test/shared/mocks";

// import { showPaymentPopup } from "client_balance_payment/reducer/actions";

import { buildCreateCall } from "call_search/offers_list/commands";

test("call_search/offers_list/commands buildCreateCall", function(t) {
  // t.test("on 'insufficient_balance' response", function(t) {
  //   let fetcher = new Fetcher();
  //   let dispatch = buildSpyOnce();
  //   let callData = {interpreterId: 1, searchId: 2};

  //   setupInsufficientBalanceResponse(fetcher, callData);

  //   let expectedAction = showPaymentPopup({showNotEnoughFunds: true});
  //   buildCreateCall({callData, fetcher, dispatch})()
  //     .then(() => t.same(dispatch.calledWith, [expectedAction], "calls dispatch with correct action"), failTestOnReject(t))
  //     .finally(() => t.end());
  // });

  t.test("on 200 response", function(t) {
    let fetcher = new Fetcher();
    let window = {location: {}};
    let callData = {interpreterId: 1, searchId: 2};

    let responseBody = setup200Response(fetcher, callData);

    let expectedRedirect = local.interpretationCallPath(responseBody.interpretation_call.id);

    buildCreateCall({callData, fetcher, window})()
      .then(() => t.equal(window.location.href, expectedRedirect, "redirects to call location"), failTestOnReject(t))
      .finally(() => t.end());
  });
  
  t.end();
});

// function setupInsufficientBalanceResponse(fetcher, callData) {
//   let response = {body: {error_info: {type: "insufficient_balance", amount: 3}}, status: 401};

//   mockLocation({fetcher, response, callData});
// }

function setup200Response(fetcher, callData) {
  let body = {interpretation_call: {id: 122}};
  let response = {body};

  mockLocation({fetcher, response, callData});

  return body;
}

function mockLocation({fetcher, response, callData}) {
  let request = {body: {call_search_id: callData.searchId, interpreter_id: callData.interpreterId, user_agent: "web"}, method: "POST"};
  fetcher.fetchApi.mockOnce({location: interpretationCallsPath(), request, response});
}