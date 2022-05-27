import React from 'react';
import "translator_data_modal/_style/rating_window.scss";
import ModalWindow from 'modal_window/modal_window';
import ModalWindowCard from 'translator_data_modal/modal_window_card';
import {t} from 'i18n';

const RatingWindow = ({active, setActive, clientReviews}) => {
    return (
        <ModalWindow active={active} setActive={setActive} modalTitle={t("global.interpreter.rating")}>
            {t("global.interpreter.rating_text")}

            {clientReviews?.length > 0 && 
                <div className="modal_rating">
                    <div className="rating_body">
                        <div className="rating_body-title">{t("global.interpreter.reviews")}</div>
                        <div className="rating_body-subtitle">{t("global.interpreter.reviews_text")}</div>
                    </div>
                    {clientReviews.map((rev, index) => {
                        return (
                            <div key={index} className="rating_review">
                                <div className="rating_review-title">
                                    <Rating score={rev.score} />
                                    <span className="rating_review-client"> {rev.client}</span>
                                </div>
                                <div className="rating_review-comment">{"<<"}{rev.comment}{">>"}</div>
                            </div>
                        )
                    })}
                </div>
            }
        </ModalWindow>
    )
}


function Rating({score}) {
    return (
      <ul className="rating">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1 
  
          return (
            <li key={i} className={ratingValue <= score ? "rating-item active" : "rating-item"}>
              <i className="fas fa-star"></i>
            </li>
          )
        })}
      </ul>
    )
  }

export default RatingWindow
