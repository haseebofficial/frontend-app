import 'search/_styles/search_page/result/result.scss';
import React, { useContext, useState, useEffect } from "react";
import { ContextSearchForm } from "app/app_root";
import { ContextSearchMobileMenu } from "app/app_root";
import ResultCard from "search/search_page/result/card";
import { useScrollElementTop } from 'react_utils/scroll_link';
import { useParams, useLocation } from 'react-router-dom';
import { $host } from '../../../http';
import { SearchPageContext } from '../search_page';
import {t} from 'i18n';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResult({refPage, isLoading}) {
  let params = useParams()
  let { showDateVisible, toggleDateVisible } = useContext(ContextSearchForm)
  let [isLoadInt, setIsLoadInt] = useState(false)
  let { tabs, currentTab, setTab } = useContext(ContextSearchMobileMenu)
  let { search, freeInterpretersCount, totalInterpretersCount, freeInterpreters, setFreeInterpreters, interpretersPagination, setInterpretersPagination } = useContext(SearchPageContext)
  let query = useQuery();

  function changeDateAndTime() {
    setTab(tabs.searchForm)
    showDateVisible()
    useScrollElementTop(refPage, -120)
  }

  async function loadMoreTranslators() {
    console.log("interpretersPagination.next_page: ", interpretersPagination.next_page)
    console.log(`searches/${params.id}?$page=${interpretersPagination.next_page}`)
    setIsLoadInt(true)
    try {
      let newData = await $host.get(`searches/${params.id}?page=${interpretersPagination.next_page}&locale=${params.locale}`).then(res => res.data)
      setFreeInterpreters(freeInterpreters.concat(newData.free_interpreters.items))
      setInterpretersPagination(newData.free_interpreters.pagination)
      console.log("newData: ", newData)
      console.log("newData.free_interpreters.items: ", newData.free_interpreters.items)
      setIsLoadInt(false)
    } catch (e) {}
  }

  useEffect(() => {
    if (query.get("changeDateTime") === 'true') {
      toggleDateVisible()
    }
  }, [])
  return (
    !isLoading &&
    <div className="result-container">
      <div className="result-header">
        {/* <span className="result-title">{freeInterpretersCount ? freeInterpretersCount : 0} из {totalInterpretersCount ? totalInterpretersCount : 0} переводчиков в Милане<br className="touch-new-line"/> доступны для заказа</span> */}
        {/* <span className="result-title">{freeInterpretersCount} из {totalInterpretersCount} переводчиков в {search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name}<br className="touch-new-line"/> доступны для заказа</span> */}
        <span className="result-title"> {t("global.search_page.available_interpreters.other").replace('%{free}', freeInterpretersCount).replace('%{count}', totalInterpretersCount).replace('%{city}', search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}</span>

        <div className="columns is-vcentered result-subtitle-desktop">
          <span className="result-subtitle column has-grey-text">{t("global.search_page.duration_text").replace('%{duration}', search?.duration_text).replace('%{intervals}', search?.intervals_text)}   <a className="result-header-button" onClick={changeDateAndTime}>{t("global.search_page.change_date")} </a></span>
        </div>
        <div className="columns is-vcentered is-smallest-gap  result-subtitle-touch">
          <span className=" column result-subtitle is-8 has-grey-text">{t("global.search_page.duration_text").replace('%{duration}', search?.duration_text).replace('%{intervals}', search?.intervals_text)}</span>
          <div className="column is-3">
            <button className="button " onClick={changeDateAndTime}>{t("global.search_page.change_date")} </button>
          </div>
        </div>
        <span className="header-description">{t("global.search_page.free_cancellation")}</span>
      </div>

      <div className="result-cards">
        {freeInterpreters?.map(interpreter => {
          return <ResultCard key={interpreter.id} interpreter={interpreter} search={search} />
        })}
        {/* <ResultCard/>
        <ResultCard/> */}
        {
          interpretersPagination?.next_page
          ? <>
            { isLoadInt ? <i className="fas fa-spinner fa-spin"/>
              : <div className="field main-field control">
                <button onClick={loadMoreTranslators} className="button result-cards-button is-interpreters-yellow is-fullwidth ">{t("search_form.filter.show_result")}</button>
              </div>
            }
          </>
          : <div className='result-bottom'></div>
        }
      </div>
    </div>
  );
}