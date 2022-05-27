import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import { InAppPage } from "test/lib/app/test_helpers";
import { mockClientReviews } from "test/lib/client_reviews/test_helpers";
import BestClientReviews from "client_reviews/best_client_reviews";

test("BestClientReviews", function(t) {
  t.test("basic usage", function(t) {
    t.test("fetches reviews and displays them in a carousel", async function(t) {
      mockClientReviews([{comment: "Review 1"}, {comment: "Review 2"}]);

      let widget = render(<InAppPage><BestClientReviews/></InAppPage>);
      await fetch.awaitRequests();

      t.true(widget.queryByText(/Review 1/));
      t.false(widget.queryByText(/Review 2/));
      widget.unmount();

      t.end();
    });
  });
});