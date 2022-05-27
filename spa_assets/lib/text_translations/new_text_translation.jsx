import "text_translations/_styles/new_text_translation.scss";
import React from "react";
import i18n from "i18n";
import locales from "i18n/locales";
import LayoutBody from "layout/layout_body";
import RequestForm from "text_translations/new_text_translation/text_translation_form";
import BestClientReviews from "client_reviews/best_client_reviews";
import LayoutHelmet from "layout/layout_helmet";

export default function NewTextTranslation() {
  let t = i18n.scoped("text_translations");

  return(
    <LayoutBody currentService={"textTranslation"}>
      <LayoutHelmet 
        title={t("head.title")} 
        description={t("head.description")} 
        keywords={t("head.keywords")} 
        pageLocales={[locales.en, locales.ru]}
      />
      <div className="translation-page" testid="translation-page">
        <div className="columns">
          <div className="column">
            <span className="page-title">{t("header")}</span>
          </div>        
        </div>
        <div className="columns is-centered has-text-centered has-text-interpreters-green">
          <div className="column is-half has-text-interpreters-green">
            <span>{t("description")}</span>
          </div>
        </div>
        <RequestForm/>

        <div className="description-container">
          <div className="columns has-text-centered">
            <div className="column is-full">
              <span className="is-family-black has-text-interpreters-yellow is-size-header-2">{t("why.header")}</span>
            </div>
          </div>

          <div className="columns is-variable is-8 description-columns has-text-centered">
            <div className="column is-one-third description-column">
              <span className="icon is-large is-hidden-touch"><i className="fas fa-3x fa-award"/></span>
              <span className="description-header">{t("why.quality")}</span>
              <span className="description-text">{t("why.quality_desc")}</span>
            </div>
            <div className="column is-one-third description-column">
              <span className="icon is-large is-hidden-touch"><i className="far fa-3x fa-thumbs-up"/></span>
              <span className="description-header">{t("why.price")}</span>
              <span className="description-text">{t("why.price_desc")}</span>
            </div>
            <div className="column is-one-third description-column">
              <span className="icon is-large is-hidden-touch"><i className="fas fa-3x fa-flip-vertical fa-history"/></span>
              <span className="description-header">{t("why.time")}</span>
              <span className="description-text">{t("why.time_desc")}</span>
            </div>
          </div>
        </div>

        <div className="reviews-container">
          <BestClientReviews/>
        </div>
      </div>
    </LayoutBody>
  );
}
