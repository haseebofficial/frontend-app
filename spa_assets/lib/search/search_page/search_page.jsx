import 'search/_styles/search_page/search_page.scss';
import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import routes from "app/routes";
import L from 'leaflet';
import { Map, TileLayer, Circle, CircleMarker, Popup, Marker, Tooltip } from 'react-leaflet';
import { ContextSearchMobileMenu } from "app/app_root";
import LayoutBody from "layout/layout_body";
import LayoutHelmet from "layout/layout_helmet";
import FormSearch from "search/form";
import SearchFilter from "search/search_page/filter";
import SearchResult from "search/search_page/result";
import SearchInfo from "search/search_page/info";
import { useParams } from 'react-router-dom';
import { $host } from 'http';
import api from "api_routes";
import getDatetimeResults from 'react_utils/get_datetime';
import {t} from 'i18n';

export let SearchPageContext = React.createContext()

export default function SearchPage() {
  let [currentSearch, setCurrentSearch] = useState(null);
  let createSearch = (id) => setCurrentSearch({id: id});

  let params = useParams()
  let [data, setData] = useState()
  let [isLoading, setIsLoading] = useState()
  let [cityLocation, setCityLocation] = useState()
  let [search, setSearch] = useState()
  let [initialDatetimeResults, setInitialDatetimeResults] = useState()
  let [freeInterpreters, setFreeInterpreters] = useState()
  let [interpretersPagination, setInterpretersPagination] = useState()
  let [totalInterpretersCount, setTotalInterpretersCount] = useState(0)
  let [freeInterpretersCount, setFreeInterpretersCount] = useState(0)
  let [serviceTypes, setServiceTypes] = useState([])

  let {tabs, currentTab, setTab} = useContext(ContextSearchMobileMenu)
  let refPage = useRef(null)

  const getData = async () => {
    setIsLoading(true)
    try {
      const data = await $host.get(`searches/${params.id}?locale=${params.locale}`).then(res => res.data)
      console.log("getDatetimeResults API: ", getDatetimeResults(data.search.intervals))
      setInitialDatetimeResults(getDatetimeResults(data.search.intervals))
      setData(data)
      setSearch(data.search)
      setCityLocation({
        lat: data.search.city.latitude,
        lng: data.search.city.longitude
      })
      setFreeInterpretersCount(data.free_interpreters_count)
      setTotalInterpretersCount(data.total_interpreters_count)
      setFreeInterpreters(data.free_interpreters.items)
      setInterpretersPagination(data.free_interpreters.pagination)
      setServiceTypes(data.service_types)
      setIsLoading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getData()
    console.log("api.specializationsPath(): ", api.specializationsPath())
  }, [])

  if (currentSearch) {
    window.location.reload()
    return <Redirect to={routes.spaSearchPath({id: currentSearch.id})}/>;
  } else {
  return (
    <SearchPageContext.Provider value={{
      isLoading, data, search, freeInterpreters, setFreeInterpreters, interpretersPagination, setInterpretersPagination, totalInterpretersCount, freeInterpretersCount, serviceTypes
    }}>
    <div ref={refPage}></div>
    <LayoutBody currentService="search" citySelected={true} linearLayout={true} city={search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name} isLoading={isLoading}>
      <LayoutHelmet/>
      <div className="search-page">
        <MobileTabs currentTab={currentTab} setTab={setTab} tabs={tabs}/>

        <MobileTabContent tab={tabs.searchForm} currentTab={currentTab}>
          <div className="fullwidth-form-wrapper">
            <div className="container">
              { !isLoading && <FormSearch search={search} initialDatetimeResults={initialDatetimeResults} onSubmit={createSearch}/> }
              <div className="is-hidden-desktop">
                <SearchInfo/>
              </div>

            </div>
          </div>
        </MobileTabContent>

        <div className="columns">
          <MobileTabContent tab={tabs.filter} currentTab={currentTab} className="column is-3">
            
            <div className="search-map is-hidden-mobile">
              {/* <Map onclick={changeMarkerLocation} center={cityLocation} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}> */}
              <Map center={cityLocation} zoom={9} scrollWheelZoom={true} style={{ zIndex: 1, height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  accessToken="pk.eyJ1IjoiYWxleGV5ZHMiLCJhIjoiY2p0cHkwbWNlMDAzdzQ1cW5oNm9sOTdjYyJ9.XOGmLdeCvY84Fo6gKmWzjw"
                />
                <Circle center={cityLocation} pathOptions={{ fillColor: 'red' }} radius={200} />
                <CircleMarker
                  center={cityLocation}
                  pathOptions={{ color: 'red'}}
                  radius={20}>
                    <Tooltip direction='center' permanent className="texttooltip">
                      <span>{totalInterpretersCount}</span>
                    </Tooltip>
                  {/* <Popup>{totalInterpretersCount}</Popup> */}
                </CircleMarker>
              </Map>
            </div>
            <SearchFilter/>
          </MobileTabContent>

          <MobileTabContent tab={tabs.result} currentTab={currentTab} className="column">
            <SearchResult refPage={refPage} isLoading={isLoading} />
          </MobileTabContent>
        </div>
      </div>
    </LayoutBody>
    </SearchPageContext.Provider>
  );
  }
}

function MobileTabs({currentTab, setTab, tabs}) {
  return (
    <ul className="mobile-tabs">
      <MobileTab currentTab={currentTab} setTab={setTab} tab={tabs.result} tabs={tabs}/>
      <MobileTab currentTab={currentTab} setTab={setTab} tab={tabs.filter} tabs={tabs}/>
      <MobileTab currentTab={currentTab} setTab={setTab} tab={tabs.searchForm} tabs={tabs}/>
    </ul>
  );
}

function MobileTab({currentTab, tab, setTab, tabs}) {
  let tempTabNames = {    
    [tabs.result]: t("global.search_page.result"),
    [tabs.filter]: t("global.search_page.filter"),
    [tabs.searchForm]: t("global.search_page.search")
  };

  let activityClass = tab === currentTab ? "is-active" : "";
  return (
    <li>
      <a onClick={() => setTab(tab)} className={`search-tab ${activityClass}`}>
        {tempTabNames[tab]}
      </a>
    </li>
  );
}

function MobileTabContent({currentTab, tab, children, className=""}) {
  let activityClass = tab === currentTab ? "is-active" : "";

  return (
    <div className={`search-tab-content ${activityClass} ${className}`}>
      {children}
    </div>
  );
}