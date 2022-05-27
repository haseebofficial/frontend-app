import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import { signInUser } from "test/lib/login/test_helpers";
import { InAppPage, currentPagePath } from "test/lib/app/test_helpers";
import { ProtectedPage } from "app_page";

test("ProtectedPage", function(t) {
  t.test("redirects if user is not logged in", function(t) {
    let page = render(
      <InAppPage currentPath="/admin" route="/admin">
        <ProtectedPage><div testid="admin-page"/></ProtectedPage>
      </InAppPage>
    );

    t.false(page.queryByTestId("admin-page"));
    t.notEqual(currentPagePath(page), "/admin");
  
    t.end();
  });

  t.test("renders children if user is logged in", function(t, {store}) {
    signInUser(store);
    let page = render(
      <InAppPage currentPath="/admin" route="/admin" store={store}>
        <ProtectedPage><div testid="admin-page"/></ProtectedPage>
      </InAppPage>
    );

    t.true(page.queryByTestId("admin-page"));
  
    t.end();
  });

  t.test("redirects if user's role doesnt match allowedRoles", function(t, {store}) {
    signInUser(store, {role: "interpreter"});
    let page = render(
      <InAppPage currentPath="/admin" route="/admin" store={store}>
        <ProtectedPage allowedRoles={["admin"]}><div testid="admin-page"/></ProtectedPage>
      </InAppPage>
    );

    t.false(page.queryByTestId("admin-page"));
  
    t.end();
  });

  t.test("renders children if user role matches allowedRoles", function(t, {store}) {
    signInUser(store, {role: "admin"});
    let page = render(
      <InAppPage currentPath="/admin" route="/admin" store={store}>
        <ProtectedPage allowedRoles={["admin"]}><div testid="admin-page"/></ProtectedPage>
      </InAppPage>
    );

    t.true(page.queryByTestId("admin-page"));
  
    t.end();
  });
});