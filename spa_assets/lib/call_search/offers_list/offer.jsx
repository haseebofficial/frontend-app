import React from "react";
import { questionnaireStarsClass } from "utils/shared_classes";

export default function Offer({ offer, createCall, i18n }) {
  let t = i18n.scoped("call_search.offers_list.offer");

  return (<div className="interpretation-call-interpreter">
    <a href="#">
      <div className="photo-wrapper">
        <img testid="offer-photo" src={offer.photo_url} alt={offer.name} className="img" width="100px" height="100px"/>
      </div>
    </a>
    <div className="desc">
      <div className="call-button">
        <a href="#" testid="create-call" onClick={createCall}>
          <div className="call-button-image"/>
        </a>
      </div>
      
      <div className="name">
        {offer.name}
      </div>

      <span className={`${questionnaireStarsClass(offer.score)} questionnaire-stars`}></span>
      {offer.client_reviews_count > 0 &&
        <span testid="client-reviews-count" className="client-reviews-count">({offer.client_reviews_count})</span>
      }

      <div className="price">
        {t("price_minute", {price_minute: offer.price_minute, currency_code: "EUR"})}
      </div>
    </div>
    <div className="clear"></div>
  </div>);
}