import React from 'react';
import AppRoot from "app/app_root";
import { render } from 'react-dom';

document.addEventListener("DOMContentLoaded", function() {
  let reactRoot = document.getElementById("react-root");

  if (reactRoot) {
    render(<AppRoot/>, reactRoot);
  }
});
