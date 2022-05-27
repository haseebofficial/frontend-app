import React from "react";
import TestRenderer from 'react-test-renderer';

import { GlobalsProvider } from "react_utils/globals";
import buildStore from "store";
import { stubI18n } from "test/shared/translations";

export default function render(component, options) {
  let [Component, globals] = addGlobals(component, options);
  return new RenderedComponent(Component, globals);
}

function addGlobals(component, options) {
  if (options && options.provideGlobals) {  
    let store = buildStore();
    let i18n = stubI18n();
    i18n = options.provideGlobals === true ? i18n : (options.provideGlobals.i18n || i18n);
    let globals = { i18n, fetcher: "stub", store: store };

    let Component = <GlobalsProvider {...globals}>{component}</GlobalsProvider>;

    return [Component, globals];
  } else {
    return [component, {}];
  }
}

class RenderedComponent {
  constructor(component, globals) {
    let renderer = TestRenderer.create(component);

    this.globals = globals;
    this._renderer = renderer;
    this._root = renderer.root;
  }

  isEmpty() {
    return this._renderer.toJSON() === null;
  }

  find(testid) {
    return this._root.findByProps({testid});
  }

  getText(testid) {
    return this.find(testid).children[0];
  }

  hasElement(testid) {
    try {
      this.find(testid);
      return true;
    } catch(e) {
      return false;
    }
  }

  click(testid) {
    let click = this.find(testid).props.onClick;

    if (click) {
      click();
    }
  }
}