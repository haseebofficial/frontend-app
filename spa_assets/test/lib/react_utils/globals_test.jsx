import test from "tape";
import React from "react";
import render from "test/shared/react_renderer";
import { consumeGlobals, GlobalsProvider } from "react_utils/globals";
import buildStore from "store";
import { initalTestReducerState, getTestReducerState } from "test/lib/store/test_reducer";

function Consumer(props) {
  return <div testid="test" consumedProps={props}/>;
}

function getProps(instance) {
  return instance.find("test").props.consumedProps;
}

test("consumeGlobals", function(t) {
  t.test("basic globals delegation", function(t) {
    let TestComponent = consumeGlobals(Consumer);

    let globals = {i18n: "i18n", foo: "bar"};
    let instance = render(
      <GlobalsProvider {...globals}>
        <TestComponent/>
      </GlobalsProvider>
    );

    let props = getProps(instance);

    t.equal(props.i18n, globals.i18n);
    t.equal(props.foo, globals.foo);
    t.equal(props.children, undefined, "doesn't delegate `children` prop");
  
    t.end();
  });

  t.test("own props", function(t) {
    let TestComponent = consumeGlobals(Consumer);

    let instance = render(
      <GlobalsProvider foo="bar">
        <TestComponent ownProp={123} foo="baz"/>
      </GlobalsProvider>
    );

    let props = getProps(instance);

    t.equal(props.ownProp, 123, "passes own props to object");
    t.equal(props.foo, "baz", "own props override globals");
  
    t.end();
  });

  t.test("store delegation", function(t) {
    let TestComponent = consumeGlobals(Consumer);

    let store = buildStore();
    let instance = render(
      <GlobalsProvider store={store}>
        <TestComponent/>
      </GlobalsProvider>
    );

    let props = getProps(instance);

    t.equal(props.store, undefined, "doesn't provide store in own props");

    t.equal(props.dispatch, store.dispatch, "provides store.dispatch");
  
    t.end();
  });

  t.test("consuming globals without providing them", function(t) {
    let TestComponent = consumeGlobals(Consumer);

    t.doesNotThrow(() => render(<TestComponent/>));
  
    t.end();
  });

  t.test("mapStateToProps option", function(t) {
    let TestComponent = consumeGlobals(Consumer, function(state) {
      return { foobar: getTestReducerState(state) };
    });

    let store = buildStore(initalTestReducerState(123));
    let instance = render(
      <GlobalsProvider store={store}>
        <TestComponent/>
      </GlobalsProvider>
    );

    let props = getProps(instance);

    t.equal(props.foobar, 123, "merges state to props");

    t.end();
  });

  t.end();
});