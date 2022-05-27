import "search/_styles/new_search_page.scss";
import { Redirect, useLocation } from "react-router-dom";
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from 'react-router-dom';
import routes from "app/routes";
import LayoutBody from "layout/layout_body";
import BestClientReviews from "client_reviews/best_client_reviews";
import LayoutHelmet from "layout/layout_helmet";
import FormSearch from "search/form";
import { $host } from "../http";
import {t} from 'i18n';

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      const response = await fetch(url, {method, body, headers})
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }
      setLoading(false)
      return data
    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])
  const clearError = () => setError(null)
  return { loading, request, error, clearError }
}

export default function NewSearchPage() {
  let [currentSearch, setCurrentSearch] = useState(null);
  let createSearch = (id) => setCurrentSearch({id: id});
  const [dashboard, setDashboard] = useState({country_count: 0, city_count: 0, interpreter_count: 0});

  const getDashboard = () => {
    $host('dashboards').then(res => {
        setDashboard(res.data)
    })
  }

  useEffect(() => {
    getDashboard()
  }, [])

  if (currentSearch) {
    return <Redirect to={routes.spaSearchPath({id: currentSearch.id})}/>;
  } else {
    return (
      <LayoutBody currentService="search">
        <LayoutHelmet/>
        <div className="new-search-page">
          <div className="columns">
            <div className="column">
              <span className="page-title" dangerouslySetInnerHTML={{__html: t("text_translations.hero.professional_interpreters")}}></span>
            </div>
          </div>
          <div className="columns is-centered has-text-centered">
            <div className="column is-5">
              <p className="main-description">{t("text_translations.hero.vetted_interpreters")}</p>
            </div>
          </div>
          <FormSearch onSubmit={createSearch}/>

          <div className="root-description">
            <div className="columns has-text-centered">
              <div className="column is-full">
                <span className="is-family-black has-text-interpreters-yellow is-size-header-2 description-title">{t("text_translations.why.header")}</span>
              </div>
            </div>
            <div className="columns  mb-is-desktop">
              <div className="column  is-6 ">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter_spa.block3.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter_spa.block3.text_html").replace("%{cities}", dashboard?.city_count).replace("%{countries}", dashboard?.country_count)}}/>
                  </div>
                  <div className="why-block-media">
                    <i className="fas fa-globe-asia"></i>
                  </div>
                </a>
              </div>

              <div className="column is-6  description-indent">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter_spa.block2.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter_spa.block2.text_html")}} />
                  </div>
                  <div className="why-block-media">
                    <i className="fas fa-comment-dollar"></i>
                  </div>
                </a>
              </div>
            </div>
            <div className="columns is-centered">
              <div className="column is-6 ">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter_spa.block1.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter_spa.block1.text_html")}} />
                  </div>
                  <div className="why-block-media">
                    <i className="fas fa-shield-alt"></i>

                  </div>
                </a>
              </div>

              <div className="column is-6 description-indent ">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter_spa.block4.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter_spa.block4.text_html")}} />
                  </div>
                  <div className="why-block-media">
                    <i className="far fa-thumbs-up"></i>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="reviews-container">
            <div className="columns is-centered">
              <div className="column is-10 ">
                <BestClientReviews/>
              </div>
            </div>
          </div>
        </div>
      </LayoutBody>
    );
  }
}
