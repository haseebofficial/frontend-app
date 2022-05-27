import "client_call/_styles/new_call/new_call.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch} from 'react-redux';
import LayoutBody from "layout/layout_body";
import useVisible from "react_utils/use_visible";
import ClientTabs from "client_utils/tabs";
import FormSearch from "client_call/form/form";
import ResultCard from "../../client_call/new_call/result_card";
import Preloader from "../../user/preloder";
import { Link, useLocation,  useHistory, useParams  } from "react-router-dom";
import routes from "app/routes";
import ServiceInfoButton, { PaymentInformationButton } from "client_call/call/service_info_button";
import {$host} from '../../http';
import {t} from 'i18n';
import {reset} from "../../twilio/reducer"


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function NewCall() {
  let formVisibility = useVisible();
  let [showHowItWorks, setShowHowItWorks] = useState(false)
  let [showPaymentInfo, setShowPaymentInfo] = useState(false)
  let [isLoading, setIsLoading] = useState(false)
  let [data, setData] = useState(false)
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  let query = useQuery();
  let history = useHistory();
  const {locale} = useParams();
  var _dispatch = useDispatch();                                        //varable to hold store.dispach function
  
  const listOfOffers= useSelector(state=>{                              //read offers when ading to redux store
    let _callId=  query.get("id");                                      // call id
    try{
      return state.callSearches[_callId.toString()].offers;             // offers are in state.callSearched[call-id].offers
      setIsLoading(false)
    }catch (e){
      return [];
    }
  })

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`interpretation_call_searches/${query.get("id")}?page=${currentPage}&locale=${locale}`).then(res => res.data);
      setData(data)
      setPagination(data?.interpreters?.pagination)
      if (data?.interpreters?.interpreters.length > 0) {
        setIsLoading(false)
      }
    } catch (e) {}
  }

  const handleCall = async (id) => {
    console.log("### --on click")
    try {
      let request = {
        call_search_id: data?.interpretation_call_search?.id,
        interpreter_id: id,
        user_agent: "mobile"
      }
      let interpretation_calls = await $host.post(`interpretation_calls`, request).then(res => res.data)
      if (interpretation_calls.error_info?.type === "missing_credit_card") {
        //todo > dispatch(show());
      } else if (interpretation_calls.error_info?.type === "unpaid_calls") {
        window.alert(t("call_search.offers_list.unpaid_calls_alert"));
      }
      else
        _dispatch(reset());
        history.push(routes.spaInterpretationCallPath({id: interpretation_calls?.interpretation_call?.id}))
    } catch (e) {
      //todo > error handling
      console.log("\nError", e)
    }
  }

  return (
    <LayoutBody>
      <div className="new-call-page">
        <ClientTabs>
          <li className="client-tabs-link">
            <Link to={routes.spaInterpretationCallsPath()}>{t("client_call.tab.my_calls")}</Link>
          </li>
          <li className="client-tabs-link active">
                {t("client_call.tab.new_call")}
          </li>
        </ClientTabs>

        <button className="button-form is-hidden-desktop" onClick={formVisibility.toggle}>{formVisibility.isVisible ? 'Скрыть форму поиска' : 'Показать форму поиска'}</button>
        <div className={`form-wrapper ${formVisibility.isVisible ? "is-active" : ""}`}>
          <FormSearch/>
        </div>

        <div className="button-wrapper is-hidden-touch">
          <ServiceInfoButton active={showHowItWorks} setActive={setShowHowItWorks} />
          <PaymentInformationButton active={showPaymentInfo} setActive={setShowPaymentInfo} />
        </div>
        <div className="columns is-centered result-wrapper">
          <div className="column is-8">
            <span className="result-title">{t("global.phone.waiting_interpreter")}</span>
            {
              !isLoading && data?.interpreters?.interpreters?.map(
                (item, index) => <ResultCard key={`interpretation_call_search${index}`} handleCall={() => handleCall(item?.user_id)} interpreter={item}/>)
            }
            { 
            listOfOffers?.map(
              (item, index) => <ResultCard key={`interpretation_call_search${index+1000}`} handleCall={() => handleCall(item?.user_id)} interpreter={item}/>)
            }
            {isLoading && <Preloader/>}
          </div>
        </div>

      </div>
    </LayoutBody>
  );
}
