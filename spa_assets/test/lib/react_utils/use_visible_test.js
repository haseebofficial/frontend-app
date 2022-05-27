import test from "test/browser_tape";
import { renderHook } from "@testing-library/react-hooks";
import useVisible from "react_utils/use_visible";

test("useVisible", function(t) {
  let current = (hook) => hook.result.current;

  t.test("sets {isVisible} to false by default", function(t) {
    let hook = renderHook(() => useVisible());
    t.equal(current(hook).isVisible, false);
  
    t.end();
  });

  t.test("returns passed value as {isVisible}", function(t) {
    let hook = renderHook(() => useVisible(true));
    t.equal(current(hook).isVisible, true);
  
    t.end();
  });

  t.test("{show} function", function(t) {
    let hook = renderHook(() => useVisible(false));
    current(hook).show();
    t.equal(current(hook).isVisible, true);
  
    t.end();
  });

  t.test("{hide} function", function(t) {
    let hook = renderHook(() => useVisible(true));
    current(hook).hide();
    t.equal(current(hook).isVisible, false);
  
    t.end();
  });

  t.test("{toggle} function", function(t) {
    let hook = renderHook(() => useVisible(false));
    current(hook).toggle();
    t.equal(current(hook).isVisible, true);
    current(hook).toggle();
    t.equal(current(hook).isVisible, false);
  
    t.end();
  });

  t.test("preserves functions' identity", function(t) {
    let hook = renderHook(() => useVisible(true));
    let { toggle, show, hide } = current(hook);

    current(hook).toggle();

    t.equal(current(hook).toggle, toggle);
    t.equal(current(hook).hide, hide);
    t.equal(current(hook).show, show);
    
    t.end();
  });
});