import test from "tape";
import React from "react";
import { buildSpyOnce } from "test/shared/mocks";

import { consumeGlobals } from "react_utils/globals";

import render from "./index.jsx";

test("Renderer#isEmpty", function(t) {
  t.test("true for null components", function(t) {  
    function Test() { return null; }
    let component = render(<Test/>);

    t.equal(component.isEmpty(), true);
  
    t.end();
  });

  t.test("false for components with content", function(t) {
    function Test() { return <div/>; }
    let component = render(<Test/>);

    t.equal(component.isEmpty(), false);
  
    t.end();
  });

  t.test("true for nested null components", function(t) {
    function Test1() { return null; }
    function Test() { return <Test1/>; }
    let component = render(<Test/>);

    t.equal(component.isEmpty(), true);
  
    t.end();
  });

  t.end();
});

test("Renderer#find", function(t) {
  t.test("finds element by testid", function(t) {
    let component = render(<div testid="foobar" abc="123"/>);

    t.equal(component.find("foobar").props.abc, "123");
  
    t.end();
  });

  t.end();
});

test("Renderer#click", function(t) {
  t.test("calls props.onClick on element with matching testid", function(t) {
    let click = buildSpyOnce();
    let component = render(<div testid="foobar" onClick={click}/>);

    component.click("foobar");

    t.true(click.isCalled);
  
    t.end();
  });

  t.test("doesn't throw if onClick is undefined", function(t) {
    let component = render(<div testid="foobar"/>);

    t.doesNotThrow(() => component.click("foobar"));
  
    t.end();
  });

  t.end();
});

test("Renderer#getText", function(t) {
  t.test("returns element's text", function(t) {
    let component = render(<div testid="test">Foobar Test</div>);

    t.equal(component.getText("test"), "Foobar Test");
  
    t.end();
  });

  t.end();
});

test("hasElement", function(t) {
  t.test("false if element is not there", function(t) {
    let component = render(<div></div>);

    t.equal(component.hasElement("test"), false);
  
    t.end();
  });

  t.test("true if element is present", function(t) {
    let component = render(<div testid="test"></div>);

    t.equal(component.hasElement("test"), true);
  
    t.end();
  });

  t.end();
});

test(".render() with provideGlobals option", function(t) {
  function Test(props) {
    return <div testid="test" testProps={props}/>;
  }
  let GlobalsConsumer = consumeGlobals(Test);

  t.test("provideGlobals: true", function(t) {
    let component = render(<GlobalsConsumer/>, {provideGlobals: true});

    let props = component.find("test").props.testProps;

    t.notEqual(props.dispatch, undefined, "provides store");
    t.notEqual(props.i18n.t, undefined, "provides i18n");
    t.notEqual(props.fetcher, undefined, "provides fetcher");
  
    t.end();
  });

  t.test("provideGlobals: false", function(t) {
    t.throws(() => {
      render(<GlobalsConsumer/>, {provideGlobals: false});
    }, /Invariant Violation/, "doesn't provide globals");
  
    t.end();
  });

  t.test("provideGlobals: {i18n}", function(t) {
    let component = render(<GlobalsConsumer/>, {provideGlobals: {i18n: 123}});

    let props = component.find("test").props.testProps;

    t.equal(props.i18n, 123, "merges i18 into globals");
    t.notEqual(props.fetcher, undefined);

    t.end();
  });

  t.end();
});

test("Render#globals", function(t) {
  t.test("returns {} without globals", function(t) {
    let component = render(<div/>);

    t.same(component.globals, {});
    
    t.end();
  });  

  t.test("returns globals object", function(t) {
    let component = render(<div/>, {provideGlobals: {i18n: 321}});
    let globals = component.globals;

    t.equal(globals.i18n, 321);
  
    t.end();
  });

  t.end();
});