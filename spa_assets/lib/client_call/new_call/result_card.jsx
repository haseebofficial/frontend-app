import "client_call/_styles/new_call/result_card.scss";
import React from "react";
import {AvatarCircle} from "user/avatar";
import call from "vendor/images/call-btn.svg";
import Rating from "user/rating";
import { Link } from "react-router-dom";
import routes from "app/routes";

export default function ResultCard({interpreter, handleCall}) {

  return (
    <div className="result-card">
      <div className="result-info">
        <div className="avatar">
          <AvatarCircle src={interpreter?.photo_url}/>
        </div>

        <div className="result-user">
          <span className="user-name">{interpreter?.name}</span>
          <Rating rate={interpreter?.ratings_count}/>
          <div className="user-price">
            ${interpreter?.price_minute} {interpreter?.currency_code}<span className="is-grey">/мин</span>
          </div>
        </div>
      </div>
      {/* <Link to={routes.spaInterpretationCallPath({id: interpreter?.id})} className="result-call">
        <img src={call} className="call-btn" alt="Call"/>
      </Link> */}
      <div onClick={handleCall} className="result-call">
        <img src={call} className="call-btn" alt="Call"/>
      </div>
    </div>
  );
}
