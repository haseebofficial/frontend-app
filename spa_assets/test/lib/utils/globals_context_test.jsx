import test from "tape";
import { toInstance, React } from "test/shared/react";
import { GlobalsProvider, globalsToProps } from "utils/globals_context";

test("utils/globals_context", function(t) {
  t.test("GlobalsProvider props delegation", function(t) {
    let HOC = globalsToProps(TestComponent);
    let instance = toInstance(<GlobalsProvider value={{my_global: 123}}><HOC foo="bar"/></GlobalsProvider>); 

    let props = instance.findByType(TestComponent).props;
    
    t.same(props.globals, {my_global: 123}, "sets wrapped component's props.globals to provided globals");
    t.equal(props.my_global, 123, "merges globals into component's props");
    t.equal(props.foo, "bar", "delegates all other props to wrapped component");

    t.end();
  });

  t.test("globalsToProps()'s HOC with displayName", function(t) {
    function TestComponent() { return ""; }
    TestComponent.displayName = "Foobar";

    let HOC = globalsToProps(TestComponent);
    t.equal(HOC.displayName, "Foobar", "sets displayName to Component.displayName");

    t.end();
  });

  t.test("globalsToProps()'s HOC without displayName", function(t) {
    function TestComponent() { return ""; }

    let HOC = globalsToProps(TestComponent);
    t.equal(HOC.displayName, "TestComponent", "sets displayName to Component.name");

    t.end();
  });

  t.test("globalsToProps()'s HOC without name and displayName", function(t) {
    let HOC = globalsToProps(function() {});
    t.equal(HOC.displayName, "Component", "sets displayName to 'Component'");

    t.end();
  });
  
  t.end();
});

function TestComponent() {
  return <div></div>;
} 