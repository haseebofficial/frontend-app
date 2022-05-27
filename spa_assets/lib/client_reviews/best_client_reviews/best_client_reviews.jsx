import "client_reviews/_styles/best_client_reviews.scss";
import React, { useState, useEffect } from "react";
import api from "api_routes";
import { t } from "i18n";
import ReviewsCarousel from "./reviews_carousel";
import { fetchJSON } from "improved_fetch";
import { $host } from "../../http";
import { useParams } from 'react-router-dom';

export default function BestClientReviews() {
  let [reviews, setReviews] = useState([]);
  const {locale} = useParams();

  const getReviews = async () => {
    try {
      const data = await $host.get(`client_reviews?locale=${locale}`).then(res => res.data.client_reviews)
      setReviews(data)
    } catch (e) {}
  }
  useEffect(() => {
    getReviews()
  }, [])

  return (
    <div className="best-reviews-widget">
      <div className="reviews-title">{t("client_reviews.title")}</div>
      <ReviewsCarousel reviews={reviews}/>
    </div>
  );
}