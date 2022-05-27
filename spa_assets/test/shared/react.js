import { renderToString } from "react-dom/server";
import React from "react";
import TestRenderer from 'react-test-renderer';
import { Provider } from "react-redux";
import { GlobalsProvider } from "utils/globals_context";
import { stubI18n } from "test/shared/translations";

export function toInstance(component) {
  return TestRenderer.create(component).root;
}

export function withI18nStub(Component, props) {
  props = Object.assign({}, props);
  props.i18n = stubI18n();

  return <Component {...props}/>;
}

export function GlobalsStubProvider(props) {
  let globals = { i18n: stubI18n(), fetcher: "stub" };

  return (
    <GlobalsProvider value={globals}>
      <Provider store={props.store}>{props.children}</Provider>
    </GlobalsProvider>
  );
}

export function stubEvent() {
  return { preventDefault: () => {} };
}

export function Globals({fetcher, store, children}) {
  let globals = { i18n: stubI18n(), fetcher };

  return (
    <GlobalsProvider value={globals}>
      <Provider store={store}>{children}</Provider>
    </GlobalsProvider>
  );
}

export function findByTestId(instance, testid) {
  return instance.findByProps({testid: testid});
}

export { React, Provider, renderToString as toStr };