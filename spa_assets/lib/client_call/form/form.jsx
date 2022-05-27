import 'client_call/_styles/form/form.scss';
import React, {useState, useEffect} from "react";
import routes from "app/routes";
import { useRedirection, HasRedirection } from "react_utils/redirection";
import DatetimeField from "client_call/form/datetime_field";
import {t} from 'i18n';
import {useParams, useHistory} from 'react-router-dom';
import { $host } from '../../http';

export default function FormSearch() {
  let redirection = useRedirection();
  let {locale} = useParams();
  const [schedule, setSchedule] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  let [languages, setLanguages] = useState();
  let [currentLanguage, setCurrentLanguage] = useState({});
  let history = useHistory();

  const getLanguages = async () => {
    try {
      let langs = await $host.get(`languages?locale=${locale}`).then(res => res.data)
      let data = await $host.get(`interpreterlanguages?user_language=${locale}`).then(res => res.data)
      setLanguages(data.languages)

      let currentLang = langs.languages.filter(val => val.locale === locale)
      setCurrentLanguage(currentLang[0]);

    } catch (e) {}
  }

  useEffect(() => {
    getLanguages()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    let request ={
      language_id: selectedLanguage,
      scheduled_at: schedule,
      your_language_id: currentLanguage.id,
      immediate_call: false
    }

    try {
      let res = await $host.post("interpretation_call_searches", request).then(res => res)
      if (res.status === 200) {
        let data = res.data.call_search;
        history.push(routes.spaNewInterpretationCallPath() + `?id=${data?.id}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    // <form className="call-form" onSubmit={() => redirection.redirectTo(routes.spaNewInterpretationCallPath())}>
    <form className="call-form">
      <HasRedirection redirection={redirection}/>
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
          <p className="your-lang">{t("search_form.your_language")} <a href="#" className="your-lang-link">{t("global.locales." + locale)}</a></p>
        </div>

        <div className="column is-4">
          <div className="field main-field">
            <label className="label label-empty">{t("search_form.button")}</label>
            <div className="control">
              <button onClick={handleSearch} type="button" className="button is-interpreters-yellow is-fullwidth is-uppercase">{t("search_form.connect_an_interpreter")}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
