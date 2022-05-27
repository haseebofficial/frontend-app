import test from "test/browser_tape";
import React from "react";
import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent } from "test/support/react_renderer";
import useModal, { ModalContext, useModalContext } from "modal/use_modal";

test("react_utils: Modal", function(t) {
  let current = modal => modal.result.current;

  t.test("useModal", function(t) {
    t.test("behaves like visibleClickableComponent", function(t) {
      let modal = renderHook(() => useModal());

      let { isVisible, toggle, show, hide, ref } = current(modal);

      t.equal(isVisible, false);
      t.equal(typeof show, "function");
      t.equal(typeof hide, "function");
      t.equal(typeof toggle, "function");
      t.notEqual(ref, undefined);
  
      t.end();
    });

    t.test("can be visible by default", function(t) {
      let modal = renderHook(() => useModal(true));
      t.equal(current(modal).isVisible, true);
    
      t.end();
    });

    t.test("adds is-clipped class to html if modal is shown", function(t) {
      let modal = renderHook(() => useModal());

      act(() => current(modal).show());

      t.true(document.documentElement.classList.contains("is-clipped"));
    
      t.end();
    });

    t.test("removes is-clipped class from html if modal is hidden", function(t) {
      let modal = renderHook(() => useModal(true));

      act(() => current(modal).hide());

      t.false(document.documentElement.classList.contains("is-clipped"));
    
      t.end();
    });

    t.test("removes is-clipped class from html if modal is unmounted", function(t) {
      let modal = renderHook(() => useModal(true));

      act(() => modal.unmount());

      t.false(document.documentElement.classList.contains("is-clipped"));
    
      t.end();
    });

    t.test("hides modal if ESC key is pressed", function(t) {
      let modal = renderHook(() => useModal(true));

      fireEvent.keyDown(document, {key: "Escape"});

      t.false(current(modal).isVisible);
    
      t.end();
    });

    t.test("does nothing if any other key is pressed", function(t) {
      let modal = renderHook(() => useModal(true));

      fireEvent.keyDown(document, {key: "Shift"});

      t.true(current(modal).isVisible);
    
      t.end();
    });
  });

  t.test("ModalContext", function(t) {
    t.test("is consumable by useModalContext", function(t) {
      let consumedModal;
      function Consumer() {
        consumedModal = useModalContext();
        return null;
      }

      let modal = current(renderHook(() => useModal()));
      render(<ModalContext modal={modal}><Consumer/></ModalContext>);

      t.equal(consumedModal, modal);
    
      t.end();
    });
  });
});