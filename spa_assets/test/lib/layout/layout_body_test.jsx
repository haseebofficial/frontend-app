import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import { InAppPage } from "test/lib/app/test_helpers";
import LayoutBody from "layout/layout_body";

test("LayoutBody", function(t) {
  t.test("renders children", function(t) {
    let body = render(<InAppPage><LayoutBody><div testid="test-elem"/></LayoutBody></InAppPage>);
    t.true(body.queryByTestId("test-elem"));
  
    t.end();
  });
});