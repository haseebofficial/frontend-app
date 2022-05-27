import React from "react";
import { Redirect } from "react-router-dom";
import { useCurrentPagePath } from "app_page/app_page_route";
import { getAppLocale } from "i18n";

export default function LocalizedPage({children}) {
  let currentPath = useCurrentPagePath();
  let currentPathWithAppLocale = useCurrentPagePath({locale: getAppLocale()});

  if (currentPath !== currentPathWithAppLocale) {
    return <Redirect to={currentPathWithAppLocale}/>;
  } else {  
    return children;
  }
}