import test from "test/browser_tape";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { render, fireEvent } from "test/support/react_renderer";
import useVisibleClickableComponent from "react_utils/use_visible_clickable_component";

test("useVisibleClickableComponent", function(t) {
  let current = hook => hook.result.current;

  t.test("behaves like useVisible", function(t) {
    t.test("returns {isVisible: false} by default", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent());
      t.equal(current(hook).isVisible, false);
  
      t.end();
    });

    t.test("returns {show, toggle, hide} functions", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent());
      let { show, toggle, hide } = current(hook);

      t.equal(typeof show, "function");
      t.equal(typeof toggle, "function");
      t.equal(typeof hide, "function");
    
      t.end();
    });

    t.test("sets {isVisible} to passed value", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent(true));
      t.equal(current(hook).isVisible, true);
    
      t.end();
    });
  });

  t.test("click handling", function(t) {
    function renderComponent(ref) {
      return render(<div><div testid="outside"/><div testid="inside" ref={ref}/></div>);
    }

    t.test("hides component on click outside", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent(true));
      let component = renderComponent(current(hook).ref);

      fireEvent.click(component.getByTestId("outside"));
      t.equal(current(hook).isVisible, false);

      t.end();
    });

    t.test("does nothing on click inside", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent(true));
      let component = renderComponent(current(hook).ref);

      fireEvent.click(component.getByTestId("inside"));
      t.equal(current(hook).isVisible, true);
    
      t.end();
    });

    t.test("does nothing if ref isn't attached", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent(true));
      let component = renderComponent(undefined);

      fireEvent.click(component.getByTestId("outside"));
      t.equal(current(hook).isVisible, true);
    
      t.end();
    });

    t.test("cleans up when hook is unmounted", function(t) {
      let hook = renderHook(() => useVisibleClickableComponent(true));
      let component = renderComponent(current(hook).ref);
      hook.unmount();

      fireEvent.click(component.getByTestId("outside"));

      t.pass("should have no warnings in console");
    
      t.end();
    });
  });
});