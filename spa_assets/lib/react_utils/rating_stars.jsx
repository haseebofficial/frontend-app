import React from "react"
import "react_utils/_styles/rating_stars.scss"

export default function RatingStars({score, scoreCount}) {
    return (
      <div className="rating-new">
          <div className="rating-items">
          {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1
          let width
          if (ratingValue >= 0 && ratingValue <= 2) {
            width = 100
          } else if (ratingValue === 3) {
            if (score <= 2) {
              width = 0
            } else if (score > 2) {
              width = 100
            }
          } else if (ratingValue === 4) {
            if (score < 3) {
              width = 0
            } else if (score > 3 && score <= 3.25) {
              width = 25
            } else if (score > 3.25 && score <= 3.5) {
              width = 50
            } else if (score > 3.5 && score <= 3.75) {
              width = 75
            } else if (score > 3.75) {
              width = 100
            } 
          } else if (ratingValue === 5) {
            if (score <= 4) {
              width = 0
            } else if (score > 4 && score <= 4.25) {
              width = 25
            } else if (score > 4.25 && score <= 4.5) {
              width = 50
            } else if (score > 4.5 && score <= 4.75) {
              width = 75
            } else if (score > 4.75) {
              width = 100
            } 
          }
          
            return (
              <div className="rating-item_wrapper">
                <div className="rating-item"><i className="fas fa-star"></i></div>
                <div className="rating-item_active" style={{width: `${width}%`}}><i className="fas fa-star"></i></div>
              </div>
            )
          })}
          </div>
          {scoreCount > 0 && <div className="rating-count">({scoreCount})</div>}
          
      </div>
    )
  }