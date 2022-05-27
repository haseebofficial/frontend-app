import "phone/_styles/phone_page.scss";
import React, { useRef, useState, useEffect }  from "react";
import LayoutBody from "layout/layout_body";
import BestClientReviews from "client_reviews/best_client_reviews";
import LayoutHelmet from "layout/layout_helmet";
import FormSearch from "./form/form";
// import apple from "vendor/images/app-store.png";
import InfoForm from "phone/form/info_form";
import ServiceInfoButton from "client_call/call/service_info_button";
import { useScrollElementTop } from "react_utils/scroll_link";
import { $host } from "../http";
import { useCurrentUser } from "../login/login_state";
import { useRedirection, HasRedirection } from "react_utils/redirection";
import routes from "app/routes";
import { useHistory, useParams } from "react-router-dom";
import {t} from 'i18n';

export default function PhonePage() {
  const [isClicking, setIsClicking] = useState(false)
  let [showHowItWorks, setShowHowItWorks] =useState(false)
  const formRef = useRef()
  let currentUser = useCurrentUser();
  let history = useHistory();
  
	const [dashboard, setDashboard] = useState({country_count: 0, city_count: 0, interpreter_count: 0});
  let [selectedLanguage, setSelectedLanguage] = useState();
  let [schedule, setSchedule] = useState();
  let [currentLanguage, setCurrentLanguage] = useState({});

  const getDashboard = () => {
    $host('dashboards').then(res => {
        setDashboard(res.data)
    })
  }

  useEffect(() => {
    getDashboard()
  }, [])

  const openFormInfo = async (e, params) => {
    setSelectedLanguage(params.selectedLanguage);
    setSchedule(params.schedule)
    setCurrentLanguage(params.currentLanguage);

    if (!currentUser) {
      setIsClicking(true)
      let windowWidth = window.innerWidth
      if (windowWidth < 770) {
        useScrollElementTop(formRef, -30)
      }
    } else {
      e.preventDefault()
      let request ={
        language_id: params.selectedLanguage,
        scheduled_at: params.schedule,
        your_language_id: params.currentLanguage.id,
        immediate_call: false
      }
      try {
        let res = await $host.post("interpretation_call_searches", request).then(res => res)
        if (res.status === 200) {
          let data = res.data.interpretation_call_search;
          history.push(routes.spaNewInterpretationCallPath() + `?id=${data?.id}`)
        }
      } catch (e) {}
    }  
  }

  return (
    <LayoutBody currentService="phone">
      <LayoutHelmet/>
      <div className="phone-page">
        <div className="columns">
          <div className="column is-vcentered">
            <span className="title" dangerouslySetInnerHTML={{__html: t("text_translations.hero.international_calls")}}></span>
          </div>
        </div>
        <div className="columns is-centered has-text-centered">
          <div className="column is-7">
            <span className="description" dangerouslySetInnerHTML={{__html: t("text_translations.hero.thousands_of_professional")}}></span>
            <span className="description">{t("text_translations.hero.connect_an_interpreter")}</span>
          </div>
        </div>
        <FormSearch openFormInfo={openFormInfo}/>
        { isClicking
            ? <div ref={formRef} className="phone-info-form">
              <InfoForm params={{selectedLanguage, schedule, currentLanguage}} />
              <div className="button-wrapper">
                <ServiceInfoButton active={showHowItWorks} setActive={setShowHowItWorks} />
              </div>
            </div>
            : <div className="phone-info-form">
              
              <div className="button-wrapper button-no-click">
                <ServiceInfoButton active={showHowItWorks} setActive={setShowHowItWorks} />
              </div>
            </div>
          }
        
        {/* <div className="button-wrapper"> */}
          {/* <a href="#" className="button">Как это работает</a> */}
          {/* <a href="" className="btn-apple"><img src={apple} alt="App Store"/></a> */}
        {/* </div> */}
        
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
                    <h4>{t("text_translations.why_inter.block3.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter.block3.text_html").replace("%{cities}", dashboard?.city_count).replace("%{countries}", dashboard?.country_count)}}/>
                  </div>
                  <div className="why-block-media">
                    <i className="fas fa-globe-asia"></i>
                  </div>
                </a>
              </div>

              <div className="column is-6  description-indent">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter.block2.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter.block2.text_html")}} />
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
                    <h4>{t("text_translations.why_inter.block1.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter.block1.text_html")}} />
                  </div>
                  <div className="why-block-media">
                    <i className="fas fa-shield-alt"></i>

                  </div>
                </a>
              </div>

              <div className="column is-6 description-indent ">
                <a className="why-block" href="https://www.interpreters.travel/ru/help/for_clients" target="_blank">
                  <div className="why-block-text">
                    <h4>{t("text_translations.why_inter.block4.link")}</h4>
                    <p dangerouslySetInnerHTML={{__html: t("text_translations.why_inter.block4.text_html")}} />
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
