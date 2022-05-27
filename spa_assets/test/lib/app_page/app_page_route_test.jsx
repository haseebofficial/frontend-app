import test from "test/browser_tape";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { composeRoutes } from "broutes";
import { render } from "test/support/react_renderer";
import { renderHook, current } from "test/support/react_hooks_renderer";
import { AppPageRoute } from "app_page";
import { useCurrentPagePath, useAlternateLangUrls } from "app_page/app_page_route";

test("AppPageRoute", function(t) {
  t.test("behaves like react router's Route", function(t) {
    let route = render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppPageRoute exact path="/login"><div testid="login"/></AppPageRoute>
        <AppPageRoute exact path="/users"><div testid="users"/></AppPageRoute>
      </MemoryRouter>
    );

    t.true(route.queryByTestId("login"));
    t.false(route.queryByTestId("users"));
  
    t.end();
  });

  function appPageWrapper({currentPath, route}) {
    return function Wrapper({children}) {
      return (
        <MemoryRouter initialEntries={[currentPath]}>
          <AppPageRoute exact path={route}>{children}</AppPageRoute>
        </MemoryRouter>
      );
    };
  }

  t.test("useCurrentPagePath", function(t) {
    let { userPath, usersPath } = composeRoutes(r => {
      r.route("/users");
      r.route("/:scope?/user/:id", {name: "user"});
    });

    t.test("returns current path if wrapped in AppPageRoute", function(t) {
      let wrapper = appPageWrapper({
        route: usersPath.raw, 
        currentPath: usersPath()
      });
      let path = renderHook(() => useCurrentPagePath(), {wrapper});

      t.equal(current(path), usersPath());

      t.end();
    });

    t.test("merges provided params into route's", function(t) {
      let wrapper = appPageWrapper({
        route: userPath.raw, 
        currentPath: userPath({id: 1, scope: "admins"})
      });
      let path = renderHook(() => useCurrentPagePath({id: 2}), {wrapper});

      t.equal(current(path), userPath({id: 2, scope: "admins"}));
    
      t.end();
    });

    t.test("throws error if rendered without AppPageRoute", function(t) {
      let { result } = renderHook(() => useCurrentPagePath());

      t.true(result.error.message.match(/AppPageRoute/));
    
      t.end();
    });
  });


  t.test("useAlternateLangUrls", function(t) {
    let { userPath, usersPath } = composeRoutes(r => {
      r.scope("/:locale?", r => {
        r.resources("/users", {only: ["index", "show"]});
      });
    });

    t.test("returns alternate route for each locale", function(t) {
      let wrapper = appPageWrapper({
        route: usersPath.raw, 
        currentPath: usersPath()
      });
      let routes = renderHook(() => useAlternateLangUrls(["en", "ru"]), {wrapper});
      let {en, ru} = current(routes);
      
      t.true(en.endsWith(usersPath({locale: "en"})));
      t.true(ru.endsWith(usersPath({locale: "ru"})));
  
      t.end();
    });

    t.test("returns full url", function(t) {
      let wrapper = appPageWrapper({
        route: usersPath.raw, 
        currentPath: usersPath()
      });
      let routes = renderHook(() => useAlternateLangUrls(["en"]), {wrapper});
      let {en} = current(routes);

      t.true(en.includes(window.location.host));
    
      t.end();
    });

    t.test("works with parametrized routes", function(t) {
      let wrapper = appPageWrapper({
        route: userPath.raw, 
        currentPath: userPath({id: 1})
      });
      let routes = renderHook(() => useAlternateLangUrls(["en"]), {wrapper});
      let { en } = current(routes);

      t.true(en.endsWith(userPath({id: 1, locale: "en"})));
    
      t.end();
    });
  });
});