import test from "enhanced-tape";
import describeState from "redux-describe-state";
import { buildStore } from "new_store/store";
import resetStoreState from "new_store/reset_store_state";

test("store", function(t) {
  t.test("buildStore", function(t) {
    t.test("accepts custom states", function(t) {
      let todosState = describeState({name: "todos", getInitialState: () => "my_todos"});
      let store = buildStore([todosState]);

      t.equal(store.getState().todos, "my_todos");

      t.end();
    });
  });

  t.test("resetStoreState", function(t) {
    t.test("resets store state", function(t) {
      let todosState = describeState({name: "todos", getInitialState: () => []});
      let store = buildStore([todosState]);

      store.dispatch(todosState.newAction(() => ["todo"]));
      store.dispatch(resetStoreState());

      t.same(store.getState().todos, []);
  
      t.end();
    });
  });
});