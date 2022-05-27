import test from "test/browser_tape";
import React from "react";
import { render, fireEvent } from "test/support/react_renderer";
import { HasRedirection, useRedirection } from "react_utils/redirection";
import { InAppPage, currentPagePath  } from "test/lib/app/test_helpers";

test("redirection", function(t) {
  function Page() {
    let redirection = useRedirection();
    let redirect = () => redirection.redirectTo("/other_page");

    return <HasRedirection redirection={redirection}><div testid="page-content" onClick={redirect}/></HasRedirection>;
  }

  t.test("renders children", function(t) {
    let page = render(<InAppPage><Page/></InAppPage>);

    t.true(page.queryByTestId("page-content"));

    t.end();
  });

  t.test("doesn't throw if no children are provided", function(t) {
    function EmptyPage() {
      let redirection = useRedirection();
      return <HasRedirection redirection={redirection}/>;
    }
    render(<InAppPage><EmptyPage/></InAppPage>);
  
    t.end();
  });

  t.test("redirects to specified path on redirectTo()", function(t) {
    let page = render(<InAppPage><Page/></InAppPage>);
    fireEvent.click(page.getByTestId("page-content"));

    t.equal(currentPagePath(page), "/other_page");
  
    t.end();
  });
});