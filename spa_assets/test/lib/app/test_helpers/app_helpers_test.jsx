import test from "test/browser_tape";
import React from "react";
import { useStore } from "react-redux";
import { render } from "test/support/react_renderer";
import { renderHook, current } from "test/support/react_hooks_renderer";
import { setupRootPage } from "test/lib/root_page/test_helpers";
import { useCurrentPagePath } from "app_page/app_page_route";
import { InAppPage, currentPagePath, AppRoot } from "test/lib/app/test_helpers";

test("app page helpers", function(t) {
  t.test("InAppPage", function(t) {
    t.test("renders children", function(t) {
      let page = render(<InAppPage currentPath="/login" route="/login"><div testid="login-page"/></InAppPage>);
      t.true(page.queryByTestId("login-page"));
    
      t.end();
    });

    t.test("exactly matches currentPath against route", function(t) {
      let page = render(<InAppPage currentPath="/login/user" route="/login"><div testid="login-page"/></InAppPage>);
      t.false(page.queryByTestId("login-page"));
    
      t.end();
    });

    t.test("wraps page in AppPageRoute", function(t) {
      function Page({children}) {
        return <InAppPage currentPath="/users" route="/users">{children}</InAppPage>;
      }

      let hook = renderHook(() => useCurrentPagePath(), {wrapper: Page});

      t.equal(current(hook), "/users");

      t.end();
    });

    t.test("provides default currentPath and route", function(t) {
      let page = render(<InAppPage><div testid="default-page"/></InAppPage>);

      t.true(page.queryByTestId("default-page"));
    
      t.end();
    });

    t.test("provides store", function(t) {
      let storeHook = renderHook(() => useStore(), {wrapper: InAppPage});

      t.notEqual(current(storeHook), undefined);
    
      t.end();
    });

    t.test("allows overwriting store", function(t, {store}) {
      function Page({children}) {
        return <InAppPage store={store}>{children}</InAppPage>;
      }
      let storeHook = renderHook(() => useStore(), {wrapper: Page});

      t.equal(current(storeHook), store);
    
      t.end();
    });

    t.test("current path can be extracted with currentPagePath helper", function(t) {
      let page = render(<InAppPage currentPath="/login/users" route="/login"/>);

      t.equal(currentPagePath(page), "/login/users");
    
      t.end();
    });
  });

  t.test("AppRoot", function(t) {
    t.test("supports currentPagePath", function(t) {
      setupRootPage();
      let app = render(<AppRoot/>);

      t.doesNotThrow(() => currentPagePath(app));
  
      t.end();
    });
  });
});