import test from "tape";
import { toInstance, React, GlobalsStubProvider } from "test/shared/react";
import createStore from "store";

import InterpretationCall from "interpretation_call/index";

test("InterpretationCall Template", function(t) {
  t.test("default store state", function(t) {
    let store = createStore();
    t.doesNotThrow(() => instanceWithStore(store), "renders template without error");

    t.end();
  });

  t.end();
});

function instanceWithStore(store) {
  return toInstance(
    <GlobalsStubProvider store={store}>
      <InterpretationCall/>
    </GlobalsStubProvider>
  );
}