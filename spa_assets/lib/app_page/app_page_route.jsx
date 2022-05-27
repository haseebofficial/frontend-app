import React, { createContext, useContext } from "react";
import { Route, useParams, generatePath } from "react-router-dom";

const PAGE_CONTEXT = createContext();

export default function AppPageRoute(props) {
  let route = props.path;
  return <PAGE_CONTEXT.Provider value={{route}}><Route {...props}/></PAGE_CONTEXT.Provider>;
}

export function useCurrentPagePath(customParams) {
  let { route } = usePageContext();
  let params = useParams();

  return generatePath(route, {...params, ...customParams});
}

export function useAlternateLangUrls(locales) {
  let routes = {};
  let { route } = usePageContext();
  let params = useParams();
  
  locales.forEach(l => {
    routes[l] = currentUrl() + generatePath(route, {...params, locale: l});
  });

  return routes;
}

function usePageContext() {
  let context = useContext(PAGE_CONTEXT);

  if (!context) {
    throw new Error("Could not find AppPageRoute context; make sure that your component is rendered inside <AppPageRoute>");
  }

  return context;
}

function currentUrl() {
  let port = location.port ? `:${location.port}` : '';
  return `${location.protocol}//${location.hostname}${port}`;
}