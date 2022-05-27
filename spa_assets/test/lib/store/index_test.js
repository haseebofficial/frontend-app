import test from "tape";
import buildStore from "store";
import { buildSpyOnce, buildSpy } from "test/shared/mocks";
import { subscribe } from "store";
import { 
  initalTestReducerState, 
  getTestReducerState, 
  changeTestReducerState, 
  changeStoreState 
} from "./test_reducer";

test("store buildStore()", function(t) {
  t.test("buildStore accepts preset state", function(t) {
    let store = buildStore( initalTestReducerState(3) );
    let actualState = getTestReducerState(store.getState());

    t.equal(actualState, 3);
  
    t.end();
  });

  t.end();
});

test("store subscribe()", function(t) {
  t.test("subscribe() does callback with initial state", function(t) {
    let store = buildStore( initalTestReducerState(123) );
    let callback = buildSpyOnce();

    subscribe(store, "testReducer", callback);

    t.same(callback.calledWith, [123]);
  
    t.end();
  });

  t.test("subscribe() subscribes to store updates", function(t) {
    let store = buildStore();
    let callback = buildSpy();

    subscribe(store, "testReducer", callback);
    store.dispatch( changeTestReducerState(123) );

    t.equal(callback.calls.length, 2);
    t.same(callback.calls[1], [123]);
    
    t.end();
  }); 

  t.test("subscribe() callback is not triggered if state was not updated", function(t) {
    let store = buildStore();
    let callback = buildSpy();

    subscribe(store, "testReducer", callback);
    store.dispatch( changeStoreState() );

    t.equal(callback.calls.length, 1);
  
    t.end();
  });

  t.test("subscribe() correctly updates state", function(t) {
    let store = buildStore( initalTestReducerState(123) );
    let callback = buildSpy();

    subscribe(store, "testReducer", callback);
    store.dispatch( changeTestReducerState(321) );
    store.dispatch( changeTestReducerState(123) );

    t.same(callback.calls, [ [123], [321], [123] ]);
  
    t.end();
  });

  t.end();
});