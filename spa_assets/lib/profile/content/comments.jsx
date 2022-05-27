import 'profile/_styles/content/comments.scss';
import React, { useRef, useState, useContext, useEffect } from "react";
import { ProfilePageContext } from '../profile';
import { useScrollScreenBottom } from 'react_utils/scroll_link';
import {t} from 'i18n';

export default function ProfileComments() {
  let { interpreter, isLoading } = useContext(ProfilePageContext)
  const buttonRef = useRef()
  let initialQuantityToShow = 5
  let [quantityToShow, setQuantityToShow] = useState(initialQuantityToShow)
  let publishReviews = interpreter?.client_reviews.filter(rev => rev.state === "published")
  let [commentsToShow, setCommentsToShow] = useState(publishReviews?.slice(0, initialQuantityToShow))
  useEffect(()=> {
    setCommentsToShow(publishReviews?.slice(0, quantityToShow))
  }, [quantityToShow])

  const uploadNewComments = () => {
    setQuantityToShow(quantityToShow + 5)
    useScrollScreenBottom(buttonRef, 10)
  }

  return (
    <>
     { !isLoading && interpreter?.client_reviews.length > 0 &&
    <div className="profile-comments">
      <span className="comments-header">{t("global.client_reviews.about_review")}</span>
        <CommentsList clientReviews={commentsToShow}/>
        { !isLoading && publishReviews.length > quantityToShow &&
          <button className="comments-btn" onClick={uploadNewComments}>{t("global.search_page.show_more")}</button>
        }
        <div ref={buttonRef}></div>
    </div>}
    </>

  );
}

function Comment({rev}) {
  return (
    <div className="comment">
      <div className="columns is-gapless">
        <div className="column is-2">
          <Rating score={rev.score} />
        </div>

        <div className="column">
          <span className="comment-title">{rev.client}</span>
          <p className="comment-paragraph">{`<<${rev.comment}>>`}</p>
        </div>
      </div>
    </div>
  )
}

function CommentsList({clientReviews}) {
  return (
    <>
    {clientReviews?.map((rev, index) => {
      return <Comment key={index} rev={rev} />
    })}
  </>)
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