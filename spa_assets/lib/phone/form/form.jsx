import 'phone/_styles/form/form.scss';
import React, {useState, useEffect} from "react";
import routes from "app/routes";
import { useRedirection, HasRedirection } from "react_utils/redirection";
import DatetimeField from "phone/form/datetime_field";
import { useParams } from 'react-router-dom';
import { $host } from '../../http';
import {t} from 'i18n';

export default function FormSearch({openFormInfo}) {
  let redirection = useRedirection();
  let paramsLocale = useParams().locale
  const [schedule, setSchedule] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  let [languages, setLanguages] = useState();
  let [currentLanguage, setCurrentLanguage] = useState({});

  const getLanguages = async () => {
    try {
      let data = await $host.get(`languages?locale=${paramsLocale}`).then(res => res.data)
      setLanguages(data.languages)

      let currentLang = data.languages.filter(val => val.locale === paramsLocale)
      setCurrentLanguage(currentLang[0]);
    } catch (e) {}
  }

  useEffect(() => {
    getLanguages()
  }, [])

  const handleSearch = (e) => {
    openFormInfo(e, {
      schedule,
      selectedLanguage,
      currentLanguage
    })
  }

  return (
    // <form className="call-form" onSubmit={() => redirection.redirectTo(routes.spaNewInterpretationCallPath())}>
    <form className="call-form">
      {/* <HasRedirection redirection={redirection}/> */}
      <div className="columns is-variable is-smallest-gap">
        <div className="column is-4">
          <DatetimeField setSchedule={setSchedule}/>
        </div>

        <div className="column is-4">
          <div className="field main-field">
            <label className="label">{t("search_form.language")}</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select onChange={(e) => setSelectedLanguage(e.target.value)}>
                  <option value="">{t("search_form.language")}</option>
                  {languages?.map((item) => <option key={`options_${item.id}`} value={item?.id}>{item?.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <p className="your-lang">{t("search_form.your_language")} <a href="#" className="your-lang-link">{t("global.locales." + paramsLocale)}</a></p>
        </div>

        <div className="column is-4">
          <div className="field main-field">
            <label className="label label-empty">{t("search_form.button")}</label>
            <div className="control">
              <button 
                type="button" 
                className="button is-interpreters-yellow is-fullwidth is-uppercase"
                onClick={handleSearch}
              >
                {t("search_form.connect_an_interpreter")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
