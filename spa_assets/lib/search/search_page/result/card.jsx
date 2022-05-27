import 'search/_styles/search_page/result/card.scss';
import React, { useState } from "react";
import routes from "app/routes";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import EventWindow from 'translator_data_modal/event_window';
import RatingWindow from 'translator_data_modal/rating_window';
import EducationWindow from 'translator_data_modal/education_window';
import ExperienceWindow from 'translator_data_modal/experience_window';
import { $host } from '../../../http';
import {t} from 'i18n';
import RatingStars from 'react_utils/rating_stars';

export default function ResultCard({interpreter, search}) {
  let params = useParams()
  let [clientReviews, setClientReviews] = useState([])
  let [ratingVisible, setRatingVisible] = useState(false)
  let [eventVisible, setEventVisible] = useState(false)
  let [educationVisible, setEducationVisible] = useState(false)
  let [experienceVisible, setExperienceVisible] = useState(false)

  async function openRatingWindow() {
    let data = await $host.get(`searches/${params.id}}/interpreters/${interpreter?.id}?locale=${params.locale}`).then(res => res.data).then(res => res.interpreter).then(res => res.client_reviews)
    let publishReviews = data?.filter(rev => rev.state === "published")
    // let publishReviews = data
    setClientReviews(publishReviews)
    setRatingVisible(true)
  }

  return (
    <>
    {interpreter &&
    <div className="result-block">
      <div className="block-body">
        <div className="avatar">
          <Link to={routes.spaSearchInterpreterPath({id: interpreter.id, searchId: params.id})} target="_blank">
            <img src={interpreter.photo_url} alt="User Img"/>
          </Link>
        </div>

        <div className="info">
          <div className="info-header">
            <Link to={routes.spaSearchInterpreterPath({id: interpreter.id, searchId: params.id})} className="info-name" target="_blank">{interpreter?.name}</Link>
            <a className="is-hidden-desktop rating-block" onClick={() => openRatingWindow()}>
              <span className="rating">
                <RatingStars score={interpreter.score} scoreCount={interpreter.ratings_count || 0} />
              </span>
            </a>
            <span className="info-price">€{interpreter?.price}/ <span>{search?.total_hours} {t("layout.date.hours")}</span></span>
          </div>
          <div className="is-hidden-touch info-description">{interpreter?.short_summary}</div>
        </div>
      </div>
          <div className="is-hidden-desktop info-description">{interpreter?.short_summary}</div>
      <div className="result-block-footer">
        <a className="is-hidden-touch rating-block" style={{paddingLeft: `${interpreter.ratings_count ===0 ? "15px" : "6px"}`}} onClick={openRatingWindow}>
          <span className="rating">
            <RatingStars score={interpreter.score} scoreCount={interpreter.ratings_count || 0} />
          </span>
        </a>

        <a className="result-block-link" onClick={() => setEventVisible(true)}>  <span>{t("global.interpreter.events")} ({interpreter.experience_event_count})</span> <i className="fas fa-chevron-right is-hidden-desktop "></i></a>
        <a className="result-block-link" onClick={() => setEducationVisible(true)}> <span> {t("global.interpreter.education")} ({interpreter.educations_count})</span> <i className="fas fa-chevron-right is-hidden-desktop"></i></a>
        <a className="result-block-link" onClick={() => setExperienceVisible(true)}> <span>  {t("global.interpreter.experience")} ({interpreter.experience_year_count} {t("global.translation_orders.years")})</span> <i className="fas fa-chevron-right is-hidden-desktop"></i></a>
        <Link to={routes.spaSearchInterpreterPath({id: interpreter.id, searchId: params.id})}  className="button "  target="_blank" > {t("global.search_page.learn_more")} </Link>
      </div>
        <RatingWindow active={ratingVisible} setActive={setRatingVisible} clientReviews={clientReviews} />
        <EventWindow active={eventVisible} setActive={setEventVisible} events={interpreter.events} />
        <EducationWindow active={educationVisible} setActive={setEducationVisible} educations={interpreter.educations} />
        <ExperienceWindow active={experienceVisible} setActive={setExperienceVisible} experiences={interpreter.experiences} />
    </div>}
    </>
  );
}