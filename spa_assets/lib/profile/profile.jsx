import 'profile/_styles/profile.scss';
import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useLocation } from "react-router-dom";
import routes from "app/routes";
import {ContextProfilePage} from "app/app_root"
import LayoutBody from "layout/layout_body";
import LayoutHelmet from "layout/layout_helmet";
import FormSearch from "search/form";
import InterpreterProfileSidebar from "user/interpreter/profile_sidebar";
import ProfileInfo from "profile/content/info";
import ProfileComments from "profile/content/comments";
import ProfileTable from "profile/content/table";
import PreviousPageLink from "layout/navbar/links/previous_page_link";
import { useParams } from 'react-router-dom';
import { $host } from '/http';
import getDatetimeResults from 'react_utils/get_datetime';

export let ProfilePageContext = React.createContext()

export default function ProfilePage() {
  let [currentSearch, setCurrentSearch] = useState(null);
  let createSearch = (id) => setCurrentSearch({id: id});
  let [isLoading, setIsLoading] = useState()
  let {isVisibleForm} = useContext(ContextProfilePage)
  let [interpreter, setInterpreter] = useState()
  let [initialDatetimeResults, setInitialDatetimeResults] = useState()
  let [search, setSearch] = useState()
  let [previousPageData, setPreviousPageData] = useState()
  let refPage = useRef(null)
  let params = useParams()
  let locale = params.locale
  const getData = async () => {
    setIsLoading(true)
    try {
      let data = await $host(`searches/${params.searchId}/interpreters/${params.id}?locale=${locale}`).then(res => res.data)
      setInterpreter(data.interpreter)
      setInitialDatetimeResults(getDatetimeResults(data.search.intervals))
      setSearch(data.search)
      setPreviousPageData({
        id: data.search.id,
        city: data.search.city.loct_ru_name ? data.search.city.loct_ru_name : data.search.city.name
      })
      setIsLoading(false)
    } catch (e) {}
  }
  useEffect(() => {
    getData()
  }, [])
  if (currentSearch) {
    return <Redirect to={routes.spaSearchPath({id: currentSearch.id})}/>;
    window.location.reload()
  } else {
  return (
    <>
    {!isLoading &&
    <ProfilePageContext.Provider value={{
      interpreter, search, isLoading
    }}>
    <div ref={refPage}></div>
    <LayoutBody currentService="search" citySelected={true} translatorSelected={true} linearLayout={isVisibleForm} city={search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name} >
      <LayoutHelmet/>
      { isVisibleForm && 
        <div className="profile-page-form">
          <div className="fullwidth-form-wrapper">
            <div className="container">
              <FormSearch onSubmit={createSearch} search={search} initialDatetimeResults={initialDatetimeResults}/>
            </div>
          </div>
        </div>
      }
      { !isVisibleForm &&
        <div className="is-hidden-touch previous-link-full">
          <div className="container">
            <div className="previous-page-link">
              <PreviousPageLink  previousPageData={previousPageData}/>
            </div>
          </div>
        </div>
      }

      <div className="profile-page">
        <div className="columns">
          <div className="column is-4">
            <InterpreterProfileSidebar/>
          </div>
          <div className="column">
            <ProfileInfo/>
            <ProfileComments/>
            <ProfileTable refPage={refPage} />
          </div>
        </div>
      </div>
    </LayoutBody>
    </ProfilePageContext.Provider>}
    </>
  );
  }
}
