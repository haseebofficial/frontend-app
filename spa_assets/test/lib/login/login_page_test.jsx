import test from "test/browser_tape";
import React from "react";
import routes from "app/routes";
import { render } from "test/support/react_renderer";
import { signInUser } from "test/lib/login/test_helpers";
import { AppRoot } from "test/lib/app/test_helpers";
import { setupNewTextTranslationPage } from "test/lib/text_translations/new_text_translation/test_helpers";

test("App: Login page", function(t) {
  t.test("is rendered at loginPath", function(t) {
    let page = render(<AppRoot currentPath={routes.loginPath()}/>);
    t.true(page.queryByTestId("login-page"));
  
    t.end();
  });

  t.test("is not rendered at loginPath if user is signed in", async function(t, {store}) {
    signInUser(store);
    setupNewTextTranslationPage();
    let page = render(<AppRoot store={store} currentPath={routes.loginPath()}/>);
    await fetch.awaitRequests();

    t.false(page.queryByTestId("login-page"));
    page.unmount();

    t.end();
  });
});