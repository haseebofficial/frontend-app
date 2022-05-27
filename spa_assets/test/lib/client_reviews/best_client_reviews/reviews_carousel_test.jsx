import test from "test/browser_tape";
import React from "react";
import { render, fireEvent, act } from "test/support/react_renderer";
import { buildReview } from "test/lib/client_reviews/test_helpers";
import ReviewsCarousel from "client_reviews/best_client_reviews/reviews_carousel";

const SLIDE_INTERVAL = 10*1000;
const RESET_INTERVAL = 500;

function buildReviews(comments) {
  return comments.map(comment => buildReview({comment}));
}

function times(n, doSomething) {
  Array(n).fill(null).forEach(() => doSomething());
}

function cleanupRealTimers(carousel) {
  carousel.unmount();
}

test("BestClientReviews: ReviewsCarousel", function(t) {
  t.test("general behaviour", function(t) {
    t.test("displays first review by default", function(t) {
      let reviews = buildReviews(["Review 1", "Review 2"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      t.true(carousel.queryByText(/Review 1/));
      t.false(carousel.queryByText(/Review 2/));
      
      cleanupRealTimers(carousel);
      t.end();
    });

    t.test("doesn't error if there are no rewievs", function(t) {
      let reviews = buildReviews([]);
      t.doesNotThrow(() => {
        render(<ReviewsCarousel reviews={reviews}/>);
      });
    
      t.end();
    });

    t.test("displays next review slide after timeout", function(t, {fakeClock}) {
      let clock = fakeClock();
      let reviews = buildReviews(["Review 1", "Review 2"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      clock.tick(SLIDE_INTERVAL);

      t.false(carousel.queryByText(/Review 1/));
      t.true(carousel.queryByText(/Review 2/));
    
      t.end();
    });

    t.test("cycles through review slides", function(t, {fakeClock}) {
      let clock = fakeClock();
      let reviews = buildReviews(["Review 1", "Review 2"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      clock.tick(SLIDE_INTERVAL*2);

      t.true(carousel.queryByText(/Review 1/));
      t.false(carousel.queryByText(/Review 2/));
    
      t.end();
    });
  });

  t.test("next-review button", function(t) {
    t.test("cycles through review in incremental order", function(t) {
      let reviews = buildReviews(["Review 1", "Review 2", "Review 3"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      times(5, () => fireEvent.click(carousel.getByTestId("next-review-button")));

      t.true(carousel.queryByText(/Review 3/));
      
      cleanupRealTimers(carousel);
      t.end();
    });

    t.test("pauses automatic carousel cycle", function(t, {fakeClock}) {
      let clock = fakeClock();
      let reviews = buildReviews(["Review 1", "Review 2", "Review 3"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      clock.tick(SLIDE_INTERVAL/2);
      fireEvent.click(carousel.getByTestId("next-review-button"));
      clock.tick(SLIDE_INTERVAL/2);

      t.true(carousel.queryByText(/Review 2/));

      t.end();
    });

    t.test("continues automatic carousel cycle", function(t, {fakeClock}) {
      let clock = fakeClock();
      let reviews = buildReviews(["Review 1", "Review 2", "Review 3"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      clock.tick(SLIDE_INTERVAL/2);
      fireEvent.click(carousel.getByTestId("next-review-button"));

      act(() => { clock.tick(RESET_INTERVAL); });
      clock.tick(SLIDE_INTERVAL);

      t.true(carousel.getByText(/Review 3/));

      t.end();
    });
  });

  t.test("prev-review button", function(t) {
    t.test("displays prev review in cycle", function(t) {
      let reviews = buildReviews(["Review 1", "Review 2", "Review 3"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      times(4, () => fireEvent.click(carousel.getByTestId("prev-review-button")));

      t.true(carousel.queryByText(/Review 3/));
      
      cleanupRealTimers(carousel);
      t.end();
    });

    t.test("pauses automatic carousel cycle", function(t, {fakeClock}) {
      let clock = fakeClock();
      let reviews = buildReviews(["Review 1", "Review 2", "Review 3"]);
      let carousel = render(<ReviewsCarousel reviews={reviews}/>);

      clock.tick(SLIDE_INTERVAL/2);
      fireEvent.click(carousel.getByTestId("prev-review-button"));
      clock.tick(SLIDE_INTERVAL/2);

      t.true(carousel.queryByText(/Review 3/));

      t.end();
    });
  });
});