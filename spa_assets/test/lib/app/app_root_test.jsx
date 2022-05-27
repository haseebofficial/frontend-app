import test from "test/browser_tape";
import React from "react";
import routes from "app/routes";
import { getAppLocale } from "i18n";
import { render } from "test/support/react_renderer";
import { AppRoot, currentPagePath } from "test/lib/app/test_helpers";

test("AppRoot", function(t) {
  t.test("enforces locale in paths", function(t) {
    let app = render(<AppRoot currentPath={routes.loginPath({locale: undefined})}/>);
  
    t.equal(currentPagePath(app), routes.loginPath({locale: getAppLocale()}));

    t.end();
  });

  t.test("renders layout", function(t) {
    let app = render(<AppRoot currentPath={routes.loginPath()}/>);

    t.true(app.queryByTestId("layout"));
  
    t.end();
  });
});