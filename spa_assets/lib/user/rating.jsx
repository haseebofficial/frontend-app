import "user/_styles/rating.scss";
import React from "react";

export default function Rating({rate}) {

  return (
    <ul className="rating">
      <li className={`${rate >= 1 && 'active'}`}><i className="fas fa-star"></i></li>
      <li className={`${rate >= 2 && 'active'}`}><i className="fas fa-star"></i></li>
      <li className={`${rate >= 3 && 'active'}`}><i className="fas fa-star"></i></li>
      <li className={`${rate >= 4 && 'active'}`}><i className="fas fa-star"></i></li>
      <li className={`${rate >= 5 && 'active'}`}><i className="fas fa-star"></i></li>
      <li>({rate})</li>
    </ul>
  );
}
