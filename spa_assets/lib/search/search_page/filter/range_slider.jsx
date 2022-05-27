import 'search/_styles/search_page/filter/range_slider.scss';
import React from "react";

export default function RangeSlider({filter}) {
  return (
    <div className="range-body">
      <div className="range-line"></div>
      <i className="fas fa-map-marker-alt nav-left"></i>
      <i className="fas fa-map-marker-alt nav-right"></i>
      <div className="price">
        <span className="low-price">{filter?.price_min} EUR</span>
        <span className="max-price"> {filter?.price_max} EUR</span>
      </div>
    </div>
  );
}
