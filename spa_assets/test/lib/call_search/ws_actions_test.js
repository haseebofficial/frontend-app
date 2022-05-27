import test from "tape";
import callSearchWsActions from "call_search/ws_actions";
import { addOffer } from "call_search/reducer/actions";

test("callSearchWsActions", function(t) {
  t.test("with message: call_requests#confirmed", function(t) {
    let notification = { data: { interpreter: "int", search_id: 1}, message: "call_requests#confirmed" };

    let action = callSearchWsActions(notification);
    let expectedAction = addOffer({id: 1, offer: "int"});

    t.same(action, expectedAction, "returns correct addOffer action");
    
    t.end();
  });

  t.test("by default", function(t) {
    let notification = { data: {}, message: "something else" };

    let action = callSearchWsActions(notification);

    t.equal(action, undefined, "returns undefined");
    
    t.end();
  });
  
  t.end();
});