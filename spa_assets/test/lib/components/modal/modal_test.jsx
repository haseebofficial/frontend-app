import test from "tape";
import { React, toInstance, findByTestId } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";

import Modal from "components/modal";

function TestChild() { return <div/>; }
function testRendersChildren(t, instance) {
  t.doesNotThrow(() => instance.findByType(TestChild), "renders children");
} 

test("Modal component", function(t) {
  t.test("shown: falsy", function(t) {
    let modal = toInstance(<Modal><div testid="child"/></Modal>);

    t.same(modal.children, [], "renders empty template");

    t.end();
  });

  t.test("shown: true", function(t) {
    let modal = toInstance(<Modal shown={true}><TestChild/></Modal>);
    testRendersChildren(t, modal);
    
    t.end();
  });

  t.test("{hide} prop", function(t) {
    let spy = buildSpyOnce();
    let modal = toInstance(<Modal shown={true} hide={spy}/>);

    findByTestId(modal, "window-cover").props.onClick();
    t.equal(spy.isCalled, true, "calls function on window-cover click");
    
    t.end();
  });

  t.test("hide() event targets", function(t) {
    let spy = buildSpyOnce();
    let modal = toInstance(<Modal shown={true} hide={spy}/>);

    findByTestId(modal, "window-cover").props.onClick({target: 1, currentTarget: 2});
    t.equal(spy.isCalled, false, "doesn't call hide() if target !== currentTarget");
    
    t.end();
  });

  t.end();
});

test("Modal.Header", function(t) {
  t.test("basic usage", function(t) {
    let header = toInstance(<Modal shown={true}><Modal.Header><TestChild/></Modal.Header></Modal>);
    testRendersChildren(t, header);
    
    t.end();
  });

  t.test("delegated props from Modal", function(t) {
    let spy = buildSpyOnce();
    let modal = toInstance(<Modal shown={true} hide={spy}><Modal.Header></Modal.Header></Modal>);

    findByTestId(modal, "header-close-popup").props.onClick();
    t.equal(spy.isCalled, true, "calls modal's `hide` function on close-button click in header");
    
    t.end();
  });

  t.end();
});

test("Modal.Body", function(t) {
  let header = toInstance(<Modal shown={true}><Modal.Body><TestChild/></Modal.Body></Modal>);
  testRendersChildren(t, header);
  
  t.end();
});

test("Modal.Footer", function(t) {
  let header = toInstance(<Modal shown={true}><Modal.Footer><TestChild/></Modal.Footer></Modal>);
  testRendersChildren(t, header);

  t.end();
});