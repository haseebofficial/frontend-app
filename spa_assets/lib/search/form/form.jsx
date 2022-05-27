import 'search/_styles/form/form.scss';
import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import useInput, {InputField} from "react_utils/use_input";
import DatetimeField from "search/form/datetime_field";
import { $host } from '../../http';
import LanguageSelect from 'react_utils/language_select';
import {t} from 'i18n';

export default function FormSearch({onSubmit, search, initialDatetimeResults}) {
  let [city, setCity] = useState(search?.city ? `${search?.city.name} - ${search?.city.country.name}` : "")
  let [focusInCity, setFocusInCity] = useState()
  let [selectedCity, setSelectedCity] = useState(search?.city || "")
  let [selectedLanguage, setSelectedLanguage] = useState(search?.language || "")
  let [yourLanguage, setYourLanguage] = useState(search?.your_language || "")
  let [visibleYourLang, setVisibleYourLang] = useState(false)
  let [yourLanguageList, setYourLanguageList] = useState()
  let [intervals, setIntervals] = useState("")
  let [cities, setCities] = useState()
  let [languages, setLanguages] = useState()
  let [onClickSubmit, setOnClickSubmit] = useState(false)
  let paramsLocale = useParams().locale

  const getPageLanguages = async () => {
    try {
      let langs = await $host.get(`languages?locale=${paramsLocale}`).then(res => res.data.languages)
      for(let i = 0; i < langs.length; i++) {
        if(langs[i].locale === paramsLocale) {
          setYourLanguage(langs[i])
        }
      }
    } catch (e) {}
  }

  useEffect(() => {
    if(!yourLanguage) {
      getPageLanguages()
    }
  }, [])

  const getYourLangs = async () => {
    if(true) {
      try {
        let data = await $host.get(`your_language_selector?locale=${paramsLocale}&city_id=${selectedCity.id}&your_language_id=${yourLanguage.id}&language_id=${selectedLanguage.id}`).then(res => res.data)
        setYourLanguageList(data.your_languages)
      } catch (e) {} 
    }
  }

  useEffect(() => {
    getYourLangs()
  }, [selectedLanguage, yourLanguage, selectedCity])

  const getCities = async () => {
    try {
      const data = await $host.get(`cities/with_interpreters_available?locale=${paramsLocale}&your_language_id=${yourLanguage.id}&name=${city}`).then(res => res.data)
      setCities(data.cities)
      setLanguages(data.languages)
    } catch (e) {}
  }
  const getAvailableLanguages = async () => {
    try {
      let data = await $host.get(`language_selector?locale=${paramsLocale}&city_id=${selectedCity.id}&your_language_id=${yourLanguage.id}`).then(res => res.data)
      setLanguages(data.languages)
      if(!selectedLanguage) {
        setSelectedLanguage(data.languages[0])
      }
    } catch (e) {}
  }
  
  useEffect(() => {
    if(city.length >= 2) {
      getCities()
    }
    if(selectedCity) {
      getAvailableLanguages()
    }
  }, [city])

  useEffect(() => {
    if(selectedCity) {
      getAvailableLanguages()
    }
  }, [yourLanguage])
  

  async function createANewSearch(e)  {
    e.preventDefault()
    setOnClickSubmit(true)
    let request = {
      city_id: selectedCity?.id,
      language_id: selectedLanguage?.id,
      your_language_id: yourLanguage?.id,
      intervals : intervals
    }
    if(selectedCity && selectedLanguage && yourLanguage && intervals.length > 0) {
      let search = await $host.post("searches", request).then(res => res.data.search)
      onSubmit(search.id)
    }
  }
  function onFocusInCity() {
    setFocusInCity(true)
  }
  function onBlurInCity() {
    setFocusInCity(false)
  }
  function chooseACity(item) {
    setSelectedCity(item)
    setCity(`${item.name} - ${item.country.name}`)
  }
  function openYourLangList() {
    setVisibleYourLang(!visibleYourLang)
  }
  function changeYourLanguage(language) {
    setYourLanguage(language)
    setVisibleYourLang(false)
  } 
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <div className="columns is-variable is-smallest-gap">
        <div className="column is-one-quarter">
          <div className="field main-field">
            <label className="label">{t("search_form.where")} 
              { onClickSubmit && !selectedCity &&
                <span className="label-error"> {t("search_form.language_selector.blank_city")}</span>}
            </label>
            <div className="control">
              <input className="input is-fullwidth" value={city} onChange={(e) => setCity(e.target.value)} onClick={onFocusInCity} type="text" placeholder={t("search_form.city")} />
              {focusInCity && cities && city && 
                <div className="cities-list_wrapper">
                  <div className="cities-list">
                    {cities.map(city => {
                      return <div key={city.id} onClick={() => chooseACity(city)} className="city-item">{city.name} - {city.country.name}</div>
                    })}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div className="column is-one-quarter">
          <DatetimeField intervals={intervals} setIntervals={setIntervals} initialDatetimeResults={initialDatetimeResults} onClickSubmit={onClickSubmit}/>
        </div>

        <div className="column is-one-quarter">
          <div className="field main-field">
            <label className="label">{t("search_form.language")} 
            { onClickSubmit && !selectedLanguage.id &&
            <span className="label-error"> {t("search_form.js.search.errors.blank_language")}</span>}
            </label>
            <div className="control">
              <div className="select is-fullwidth select-language">
                <LanguageSelect selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languages={languages} />
              </div>
            </div>
          </div>
          <div className="your-lang_wrapper">
            <div className="your-lang">{t("search_form.your_language")}</div> 
            <div className=" your-lang_pos">
              <LanguageSelect selectedLanguage={yourLanguage} setSelectedLanguage={setYourLanguage} languages={yourLanguageList} />
            </div>
          </div>
        </div>

        <div className="column is-one-quarter">
          <div className="field main-field">
            <label className="label label-empty">{t("search_form.button")}</label>
            {/* <label className="label"></label> */}
            <div className="control">
              <button type="submit" className="button is-interpreters-yellow is-fullwidth is-uppercase" onClick={createANewSearch}>{t("search_form.button")}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}