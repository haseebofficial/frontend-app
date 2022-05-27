import React, { useState } from "react";
import { Redirect } from "react-router-dom";

export function HasRedirection({children, redirection}) {
  if (redirection.redirectedTo) {
    return <Redirect to={redirection.redirectedTo}/>;
  } else {
    return children || null;
  }
}

export function useRedirection() {
  let [redirectedTo, setRedirectedTo] = useState(null);
  let redirectTo = path => setRedirectedTo(path);

  return {
    redirectTo,
    redirectedTo
  };
}