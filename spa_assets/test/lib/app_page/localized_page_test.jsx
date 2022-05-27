import test from "test/browser_tape";
import React from "react";
import { getAppLocale } from "i18n";
import { render } from "test/support/react_renderer";
import { composeRoutes } from "broutes";
import { LocalizedPage } from "app_page";
import { InAppPage, currentPagePath } from "test/lib/app/test_helpers";

let { noLocalePath, localePath } = composeRoutes(r => {
  r.route("/no_locale");
  r.scope("/:locale?", r => {
    r.route("/locale");
  });
});

test("LocalizedPage", function(t) {
  t.test("simply renders children there is no locale in route", function(t) {
    let page = render(
      <InAppPage currentPath={noLocalePath()} route={noLocalePath.raw}>
        <LocalizedPage><div testid="my-page"/></LocalizedPage>
      </InAppPage>
    );
    
    t.true(page.queryByTestId("my-page"));

    t.end();
  });

  t.test("enforces app's locale in path", function(t) {
    let page = render(
      <InAppPage currentPath={localePath()} route={localePath.raw}>
        <LocalizedPage><div testid="my-page"/></LocalizedPage>
      </InAppPage>
    );
    
    t.equal(currentPagePath(page), localePath({locale: getAppLocale()}));
    t.true(page.queryByTestId("my-page"));
  
    t.end();
  });
});