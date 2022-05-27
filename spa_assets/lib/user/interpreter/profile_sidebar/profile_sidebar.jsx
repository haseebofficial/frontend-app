import 'user/_styles/interpreter/profile_sidebar/profile_sidebar.scss';
import React, { useState, useRef, useContext } from "react";
import avatar from 'vendor/images/avatar.png';
import useVisible from "react_utils/use_visible";
import ContactForm from "user/interpreter/profile_sidebar/contact_form";
import EventWindow from 'translator_data_modal/event_window';
import RatingWindow from 'translator_data_modal/rating_window';
import EducationWindow from 'translator_data_modal/education_window';
import ExperienceWindow from 'translator_data_modal/experience_window';
import RecommendationWindow from 'translator_data_modal/recommendation_window';
import {  useScrollScreenBottom } from 'react_utils/scroll_link';
import { ProfilePageContext } from '../../../profile/profile';
import { ShowOrderPageContext } from '../../../order/show_order/show_order';
import { ShowTranslationOrderPageContext } from '../../../translation_order/show_translation_order/show_translation_order';
import {t} from 'i18n';
import RatingStars from 'react_utils/rating_stars';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from "login/login_state";

export default function ProfileSidebar({children, preliminaryRequest}) {
  let [ratingVisible, setRatingVisible] = useState(false)
  let [eventVisible, setEventVisible] = useState(false)
  let [educationVisible, setEducationVisible] = useState(false)
  let [experienceVisible, setExperienceVisible] = useState(false)
  let { interpreter, search } = useContext(ProfilePageContext) || useContext(ShowOrderPageContext) || useContext(ShowTranslationOrderPageContext)
  let publishReviews = interpreter?.client_reviews.filter(rev => rev.state === "published")
  // let publishReviews = interpreter?.client_reviews

  return (
    <div className="profile-sidebar">
      <div className="profile-section header-section has-text-centered">
        <div className="profile-avatar">
          <img src={interpreter?.photo_url} alt="User Img"/>
        </div>
        <div>
          <span className="profile-name">{interpreter?.name}</span>
          <a className="rating-block" onClick={() => setRatingVisible(true)}>
            <div className="rating">
              <RatingStars score={interpreter?.score} scoreCount={interpreter?.ratings_count} />
            </div>
          </a>
          <span className="is-hidden-desktop header-section-paragraph">{t("global.interpreter.title_city").replace('%{city}', search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}</span>
        </div>
      </div>
      {children}
      <div className="profile-section">
        <ul className="profile-list">
          <li className="profile-list-item"><a className="profile-list-link" onClick={() => setEventVisible(true)}><span><i
            className="fas fa-user-friends"></i>{t("global.interpreter.events")} ({interpreter?.experience_event_count})</span> <i
            className="fas fa-chevron-right is-hidden-desktop "></i></a></li>
          {
            interpreter?.ratings_count !==0 &&
            <li className="profile-list-item"><a className="profile-list-link" onClick={() => setRatingVisible(true)}><span><i
              className="far fa-thumbs-up"></i>{t("global.interpreter.reviews")} ({interpreter?.ratings_count})</span> <i
              className="fas fa-chevron-right is-hidden-desktop "></i></a></li>
          }
          <li className="profile-list-item"><a className="profile-list-link" onClick={() => setExperienceVisible(true)}><span><i
            className="fas fa-briefcase"></i>{t("global.interpreter.experience")} ({interpreter?.experience_year_count} {t("global.translation_orders.years")})</span> <i
            className="fas fa-chevron-right is-hidden-desktop "></i></a></li>
          <li className="profile-list-item"><a className="profile-list-link" onClick={() => setEducationVisible(true)}><span><i
            className="fas fa-graduation-cap"></i>{t("global.interpreter.education")} ({interpreter?.educations_count})</span> <i
            className="fas fa-chevron-right is-hidden-desktop "></i></a></li>
        </ul>
      </div>

      <div className="profile-section">
        <div className="profile-list">
          { interpreter?.profile_verified &&  <ProfileConfirmation setEducationVisible={setEducationVisible}/> }
          <ContactInfoConfirmation email={interpreter?.email} mob={interpreter?.mobile_phone}/>
          { interpreter?.video_message && <Video videoLink={interpreter?.video_message}/> }
          {interpreter?.recommendations && <Recommendation text={interpreter?.recommendations} /> }
        </div>
      </div>

      <div className="profile-section profile-description-wrapper has-text-centered-desktop">
        <p className="profile-description">
          <span>{t("global.show_interpreter.response_rate")}:</span>
          <span> {interpreter?.response_rate}%</span>
        </p>
        <p className="profile-description">
          <span>{t("global.show_interpreter.avg_response_time.title")}:</span>
          <span> {t(`global.show_interpreter.avg_response_time.${interpreter?.avg_response_time?.toLowerCase() === 'within an hour' ? 'hour' : (interpreter?.avg_response_time?.toLowerCase() === 'within a few hours' ? 'few_hours' : (interpreter?.avg_response_time?.toLowerCase() === 'within a day' ? 'day' : 'few_days'))}`)}</span></p>
      </div>
      <ContactForm preliminaryRequest={preliminaryRequest}/>
      <RatingWindow active={ratingVisible} setActive={setRatingVisible} clientReviews={publishReviews} />
      <EventWindow active={eventVisible} setActive={setEventVisible} events={interpreter?.events} />
      <ExperienceWindow active={experienceVisible} setActive={setExperienceVisible}  experiences={interpreter?.experiences} />
      <EducationWindow active={educationVisible} setActive={setEducationVisible} educations={interpreter?.educations} />
    </div>
  );
}

function Recommendation({text}) {
  let [recommendationVisible, setRecommendationVisible] = useState(false)
  return (
    <>
      <div className="profile-list-item">
        <a className="profile-list-link" onClick={() => setRecommendationVisible(true)}><span><i className="far fa-check-circle"></i>{t("global.interpreter.recommendations")}</span>
        <i className="fas fa-chevron-right is-hidden-desktop "></i></a>
      </div>
      <RecommendationWindow active={recommendationVisible} setActive={setRecommendationVisible} text={text} />
    </>
  )
}


function ProfileConfirmation({setEducationVisible}) {
  let section = useVisible();
  let activityClass = section.isVisible ? "is-active" : "";
  const buttonRef = useRef()

  const openingAndScroll = () => {
    section.toggle()
    useScrollScreenBottom(buttonRef)
  }

  return (
    <div name="ProfileVerifiedListItem" ref={buttonRef} className={`profile-list-item ${activityClass}`}>
      <a className="profile-list-link" onClick={openingAndScroll}>
        <span>
          <i className="far fa-check-circle"></i>
          {t("global.interpreter.verified_profile")}
        </span>
        <i className="fas fa-chevron-right is-hidden-desktop chevron-transform"></i>
      </a>
      {section.isVisible && 
        <div className="collapse-section">
          <span className="collapse-title">{t("global.show_interpreter.dialogs.checked_and_confirmed")}</span>
          <ul className="collapse-list">
            <li><i className="fas fa-check"></i>{t("global.show_interpreter.dialogs.passport")}</li>
            <li><i className="fas fa-check"></i><a className="collapse-link"onClick={() => setEducationVisible(true)}>{t("global.show_interpreter.dialogs.documents")}</a>
            </li>
          </ul>
        </div>
      }
    </div>
  );
}

function ContactInfoConfirmation({email, mob}) {
  let section = useVisible();
  let activityClass = section.isVisible ? "is-active" : "";
  const buttonRef = useRef()
  const location = useLocation();
  // console.log("useLocation(): ", location)
  let currentUser = useCurrentUser();

  const openingAndScroll = () => {
    section.toggle()
    useScrollScreenBottom(buttonRef)
  }

  return (
    <div ref={buttonRef} className={`profile-list-item ${activityClass}`}>
      <a className="profile-list-link" onClick={openingAndScroll}>
        <span>
          <i className="far fa-check-circle"></i>
          {t("global.interpreter.verified_contacts")}
        </span>
        <i className="fas fa-chevron-right is-hidden-desktop chevron-transform"></i>
      </a>
      {section.isVisible && 
        <div className="collapse-section">
          <span className="collapse-title">{t("global.show_interpreter.dialogs.checked_and_confirmed")}</span>
          <ul className="collapse-list">
            <li><i className="fas fa-check"></i>{t("global.show_interpreter.dialogs.email_full").replace('%{email}', email)}</li>
            <li><i className="fas fa-check"></i> {t("global.show_interpreter.dialogs.phone_full").replace('%{phone}', mob)}</li>
          </ul>
          {location.pathname.split('/')[3] === 'searches' && (!currentUser && <p className="collapse-description">{t("global.show_interpreter.dialogs.contacts_available")} <a className="collapse-link" href="#"> {t("global.show_interpreter.dialogs.order_confirmation")}</a></p>)}
        </div>
      }
    </div>
  );
}

function Video({videoLink}) {
  let section = useVisible();
  let activityClass = section.isVisible ? "is-active" : "";
  const buttonRef = useRef()

  const openingAndScroll = () => {
    section.toggle()
    useScrollScreenBottom(buttonRef)
  }

  return (
    <div ref={buttonRef} className={`profile-list-item ${activityClass}`}>
      <a className="profile-list-link" onClick={openingAndScroll}>
        <span>
          <i className="fab fa-youtube"></i>
          {t("global.show_interpreter.youtube_link")}
        </span>
        <i className="fas fa-chevron-right is-hidden-desktop chevron-transform"></i>
      </a>
      {section.isVisible && 
        <div className="collapse-section">
          <iframe width="100%" src={`https://www.youtube.com/embed/${videoLink}`} frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      }
    </div>
  );
}

function Rating({score, scoreCount}) {
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
      <li>({scoreCount})</li>
    </ul>
  )
}