import test from "test/browser_tape";
import describeState from "redux-describe-state";
import { nextTick } from "test/support/event_loop";
import { buildStore } from "new_store/store";
import { initialState, loadingState, loadedState, ensureStateLoaded } from "new_store/lazy_state";

test("lazy_state", function(t) {
  t.test("state builders", function(t) {
    t.test("initialState", function(t) {
      let state = initialState("foo");

      t.equal(state.isLoading, false);
      t.equal(state.isLoaded, false);
      t.equal(state.value, "foo");
    
      t.end();
    });

    t.test("loadingState", function(t) {
      let state = loadingState("foo");

      t.equal(state.isLoading, true);
      t.equal(state.isLoaded, false);
      t.equal(state.value, "foo");
    
      t.end();
    });

    t.test("loadedState", function(t) {
      let state = loadedState("foo");

      t.equal(state.isLoading, false);
      t.equal(state.isLoaded, true);
      t.equal(state.value, "foo");
    
      t.end();
    });
  });

  t.test("ensureStateLoaded", function(t) {
    let getTodos = store => store.getState().todos;
    let todosState = describeState({
      name: "todos", 
      getInitialState: () => initialState("no_todos")
    });

    let ensureTodosLoaded = () =>
      ensureStateLoaded(todosState, () => Promise.resolve(["todo1", "todo2"]));

    t.test("sets state to isLoading", function(t) {
      let store = buildStore([todosState]);
      let initialTodos = getTodos(store);
      store.dispatch(ensureTodosLoaded());
      let todos = getTodos(store);

      t.notEqual(todos, initialTodos);
      t.equal(todos.isLoading, true);
      t.equal(todos.value, "no_todos");

      t.end();
    });

    t.test("loads state when state loader resolves", async function(t) {
      let store = buildStore([todosState]);
      store.dispatch(ensureTodosLoaded());
      await nextTick();
      let todos = getTodos(store);

      t.equal(todos.isLoaded, true);
      t.same(todos.value, ["todo1", "todo2"]);
    
      t.end();
    });

    t.test("doesn't overwrite loading state", function(t) {
      let store = buildStore([todosState]);
      store.dispatch(ensureTodosLoaded());
      let loadingTodos = getTodos(store);
      store.dispatch(ensureTodosLoaded());

      t.equal(loadingTodos, getTodos(store));
    
      t.end();
    });

    t.test("doesn't overwrite loaded state", async function(t) {
      let store = buildStore([todosState]);
      store.dispatch(ensureTodosLoaded());
      await nextTick();
      let loadedTodos = getTodos(store);
      store.dispatch(ensureTodosLoaded());
      await nextTick();

      t.equal(loadedTodos, getTodos(store));

      t.end();
    });
  });
});