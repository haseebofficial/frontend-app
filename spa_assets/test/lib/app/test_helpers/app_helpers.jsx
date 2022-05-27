import React from "react";
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from "react-router-dom";
import { buildStore } from "new_store";
import routes from "app/routes";
import AppPageRoute from "app_page/app_page_route";
import AppPages from "app/app_pages";

export function InAppPage({store, currentPath, route, children}) {
  validateAppPagePath(currentPath, route);
  currentPath = currentPath || routes.rootPath();
  route = route || routes.rootPath.raw;

  return (
    <AppBoilerplate store={store} currentPath={currentPath}>
      <AppPageRoute exact path={route}>{children}</AppPageRoute>
    </AppBoilerplate>
  );
}

function validateAppPagePath(currentPath, route) {
  if (route === undefined && currentPath === undefined) {
    return true;
  } else if (route !== undefined && currentPath !== undefined) {
    return true;
  } else {
    throw new Error(
      `Both route and currentPath must be provided in order to use InAppPage, but their values were: ` +
      `{currentPath: ${currentPath}, route: ${route}}`
    );
  }
}

export function AppRoot({store, currentPath=routes.rootPath()}) {
  return (
    <AppBoilerplate store={store} currentPath={currentPath}>
      <AppPages/>
    </AppBoilerplate>
  );
}

function AppBoilerplate({store=buildStore(), currentPath, children}) {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[currentPath]}>
        <CurrentAppPath/>
        {children}
      </MemoryRouter>
    </Provider>
  );
}

export function currentPagePath(page) {
  return page.getByTestId("current-app-path").getAttribute("currentpath");
}

function CurrentAppPath() {
  let location = useLocation();
  return <div testid="current-app-path" currentpath={location.pathname}/>;
}

export function currentAppPath(app) {
  if (app.getByTestId) {
    return app.getByTestId("current-app-path").getAttribute("currentpath");
  } else {
    return app.find("current-app-path").props.currentroute;
  }
}