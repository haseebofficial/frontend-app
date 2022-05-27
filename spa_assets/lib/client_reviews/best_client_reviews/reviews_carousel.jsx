import React, { useState, useEffect } from "react";
import { useInterval } from "react_utils/timer_hooks";

export default function ReviewsCarousel({reviews}) {
  let [touched, setTouched] = useState(false);
  let [reviewIndex, setReviewIndex] = useState(0);

  let displayNextReview = () => {
    setReviewIndex(i => nextIndex(i, {length: reviews.length}));
  };

  let displayPrevReview = () => {
    setReviewIndex(i => prevIndex(i, {length: reviews.length}));
  };

  useInterval(displayNextReview, 10*1000, { stopped: touched });

  useEffect(() => {
    if (touched) {
      let id = setTimeout(() => setTouched(false), 500);
      return () => clearTimeout(id);
    } else {
      return undefined;
    }
  }, [touched, setTouched]);

  let onNextClick = () => {
    setTouched(true);
    displayNextReview();
  };

  let onPrevClick = () => {
    setTouched(true);
    displayPrevReview();
  };

  let currentReview = reviews[reviewIndex];
  currentReview = currentReview || {isLoading: true, comment: "...", client: "..."};

  return (
    <div className="reviews-carousel">
      <div className="review">
        <div className="review-body">
          <div className="review-button-container prev-review" testid="prev-review-button" onClick={onPrevClick}>
            <div className="review-button">
              <i className="fas fa-arrow-left"/>
            </div>
          </div>
          <div className="review-icon is-hidden-touch">
            {currentReview.isLoading ? 
              <i className="fas fa-spinner fa-spin"/>
              :
              <i className="fas fa-quote-right"/>
            }
          </div>
          <div className="comment">
            {`«${currentReview.comment}»`}
          </div>
          <div className="review-button-container next-review" testid="next-review-button" onClick={onNextClick}>
            <div className="review-button">
              <i className="fas fa-arrow-right"/>
            </div>
          </div>
        </div>

        <div className="review-footer">
          <div className="client">
            {currentReview.client}
          </div>
        </div>
      </div>
    </div>
  );
}

function nextIndex(i, {length}) {
  let nextValue = i + 1;

  if (nextValue >= length) {
    return 0;
  } else {
    return nextValue;
  }
}

function prevIndex(i, {length}) {
  let prevValue = i - 1;

  if (prevValue < 0) {
    return Math.max(length - 1, 0);
  } else {
    return prevValue;
  }
}