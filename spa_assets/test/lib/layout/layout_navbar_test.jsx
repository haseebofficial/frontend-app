import test from "test/browser_tape";
import React from "react";
import api from "api_routes";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";
import { render, fireEvent } from "test/support/react_renderer";
import { InAppPage } from "test/lib/app/test_helpers";
import LayoutNavbar from "layout/navbar";
import { signInUser, getCurrentUser } from "test/lib/login/test_helpers";

export function mockSignOut() {
  mockJSON.delete(api.userSessionPath(), {status: 200, body: {success: true}});
}

test("Layout navbar", function(t) {
  t.test("logs user out on logout link click", async function(t, {store}) {
    signInUser(store);
    let layout = render(<InAppPage store={store}><LayoutNavbar/></InAppPage>);
    
    mockSignOut();
    fireEvent.click(layout.queryByTestId("logout-link"));
    await fetch.awaitRequests();
    t.false(getCurrentUser(store));

    t.end();
  });
});