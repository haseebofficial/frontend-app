import "layout/_styles/layout_body.scss";
import LayoutService from "layout/layout_service";
import React from "react";

export default function LayoutBody({children, currentService, citySelected, translatorSelected, linearLayout=false, city}) {
  return (
    <React.Fragment>
      {!linearLayout
        ? <LayoutService currentService={currentService} citySelected={citySelected} translatorSelected={translatorSelected} city={city}/>
        : <div className="layout-service_fix">
          <LayoutService currentService={currentService} citySelected={citySelected} translatorSelected={translatorSelected} city={city}/>
        </div>
      }
      
      <div className={linearLayout ? "hero-body hero-body-linear" : "hero-body"}>
        <div className="container">
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}