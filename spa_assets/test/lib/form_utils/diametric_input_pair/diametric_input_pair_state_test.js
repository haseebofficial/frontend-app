import test from "test/browser_tape";
import * as PairState from "form_utils/diametric_input_pair/diametric_input_pair_state";

function emptyState() {
  return PairState.build(["", ""]);
}

test("DiametricInputPair: State", function(t) {
  t.test("getValue", function(t) {
    t.test("returns corresponding input's value", function(t) {
      let state = PairState.build(["foo", "bar"]);

      t.equal(PairState.getValue(state, 0), "foo");
      t.equal(PairState.getValue(state, 1), "bar");
  
      t.end();
    });
  });

  t.test("setValue", function(t) {
    t.test("updates corresponding input's value without modifying previous state", function(t) {
      let state = emptyState();
      let newState = PairState.setValue(state, 0, "foo");

      t.notEqual(state, newState);
      t.equal(PairState.getValue(state, 0), "");
      t.equal(PairState.getValue(newState, 0), "foo");
    
      t.end();
    });

    t.test("makes input initialized", function(t) {
      let state = PairState.setValue(emptyState(), 0, "foo");
      state = PairState.initValue(state, 0, "bar");

      t.equal(PairState.getValue(state, 0), "foo");
    
      t.end();
    });

    t.test("swaps inputs' values if they were to be equal", function(t) {
      let state = PairState.build(["foo", "bar"]);
      state = PairState.setValue(state, 0, "bar");

      t.equal(PairState.getValue(state, 0), "bar");
      t.equal(PairState.getValue(state, 1), "foo");
    
      t.end();
    });
  });

  t.test("initValue", function(t) {
    t.test("updates corresponding input's value", function(t) {
      let state = PairState.initValue(emptyState(), 0, "foo");

      t.equal(PairState.getValue(state, 0), "foo");
  
      t.end();
    });

    t.test("only initializes input's value once", function(t) {
      let state = PairState.initValue(emptyState(), 0, "foo");
      let newState = PairState.initValue(state, 0, "bar");

      t.equal(PairState.getValue(newState, 0), "foo");
      t.equal(state, newState);
    
      t.end();
    });
  });
});