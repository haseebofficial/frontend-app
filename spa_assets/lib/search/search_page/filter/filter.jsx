import 'search/_styles/search_page/filter/filter.scss';
import React, { useState, useEffect, useContext } from "react";
import Checkbox, { ServiceCheckbox, SpecializationsCheckbox } from "./checkbox";
import RangeSlider from "./range_slider";
import SearchInfo from "search/search_page/info";
import { $host } from '../../../http';
import { useParams } from 'react-router-dom';
import { SearchPageContext } from '../search_page';
import { parseJSON } from 'date-fns';
import {t} from 'i18n';

export default function SearchFilter() {
  let {isLoading, data, search, serviceTypes} = useContext(SearchPageContext)
  let params = useParams()
  let paramsId = params.id
  let locale = params.locale
  console.log("useParams: ", useParams())
  let [isLoadSpec, setIsLoadSpec] = useState(false)
  let [paginationSpec, setPaginationSpec] = useState([])
  let [specializations, setSpecializations] = useState([])

  const getSpecialization = async (page=1) => {
    setIsLoadSpec(true)
    try {
      const spec = await $host.get(`searches/${paramsId}/specializations?locale=${locale}&page=${page}`).then(res => res.data)
      setSpecializations(specializations.concat(spec.specializations))
      setPaginationSpec(spec.pagination)
      setIsLoadSpec(false)
    } catch (e) {}
  }
  useEffect(() => {
    getSpecialization()
  }, [])
  const loadMoreSpecializations = async () => {
    getSpecialization(paginationSpec.next_page)
  }
  return (
      !isLoading &&
      <>
      <div className="search-sidebar">
        <button className="button is-hidden-desktop">{t("global.search_page.show_result")}</button>
        <div className="section border-none">
          <span className="section-label">{t("global.search_page.price").replace('%{city}', search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}:</span>
          <RangeSlider filter={search?.filter}/>
        </div>

        <div className="section">
          <span className="section-label">{t("global.search_page.services").replace('%{city}', search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}:</span>
          {serviceTypes && <>{serviceTypes.map(service => {
            return <ServiceCheckbox key={service.id} service={service} />
          })}</>}
          {/* <Checkbox/> */}
        </div>


        <div className="section">
          <span className="section-label">{t("global.search_page.specializations")}</span>
            {specializations && <>{specializations.map(spec => {
              return <SpecializationsCheckbox key={spec.id} specialization={spec} />
            })}</>}
          {
            paginationSpec.next_page &&
            <button onClick={loadMoreSpecializations} className="button">{t("search_form.filter.show_result")}</button>
          }
        </div>
        
        <div className="is-hidden-touch">
          <SearchInfo/>
        </div>
      </div>
      </>
  );

}
