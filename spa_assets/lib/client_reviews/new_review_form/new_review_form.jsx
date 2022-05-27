import 'client_reviews/_styles/new_review_form.scss';
import React, { useState } from "react";
import {t} from 'i18n';

export default function NewReviewForm({handleReviewOrder}) {
  const [comment, setComment] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReviewOrder({
      score: parseInt(e.target.elements.score.value),
      interpretation_score: parseInt(e.target.elements.interpretation_score.value),
      punctuality_score: parseInt(e.target.elements.punctuality_score.value),
      consultation_score: parseInt(e.target.elements.consultation_score.value),
      comment: e.target.elements.comment.value
    });
  }

  return (
    <form className="new-client-review-form" onSubmit={handleSubmit}>
      <span className="title">{t("global.client_reviews.leave_review")}</span>
      <ItemRating title={t("global.client_reviews.score")} name="score" />
      <ItemRating title={t("global.client_reviews.interpretation_score")} name="interpretation_score" />
      <ItemRating title={t("global.client_reviews.punctuality_score")} name="punctuality_score" />
      <ItemRating title={t("global.client_reviews.consultation_score")} name="consultation_score" />

      <div className="field">
        <textarea className="textarea" name="comment" placeholder={t("global.client_reviews.comment")}></textarea>
      </div>

      <button className="button-yellow">{t("global.forms.send_button")}</button>
    </form>
  );
}

function ItemRating({title, name}) {
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  return (
    <div className="review-rating">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i +1 

        return (
          <label key={i}>
            <input 
              type="radio"
              name={name}
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <i 
              className={ratingValue <= (hover || rating) ? "fas fa-star active" : "fas fa-star"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            ></i>
          </label>
        )
      })}
      <span className="rating-item-title">{title}</span>
    </div>
  )
}