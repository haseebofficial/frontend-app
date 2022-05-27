import 'profile/_styles/content/info.scss';
import React, {useContext} from "react";
import { ProfilePageContext } from '../profile';
import {t} from 'i18n';

export default function ProfileInfo() {
  let { interpreter, search } = useContext(ProfilePageContext)

  return (
    <div className="profile-info">
      <div className="info-section">
        <span className="info-title is-hidden-touch">{t("global.interpreter.title_city").replace('%{city}', search?.city.loct_ru_name ? search?.city.loct_ru_name : search?.city.name)}</span>
        <p className="info-paragraph">{interpreter?.short_summary}</p>
        <br/>
        <p className="info-paragraph">{interpreter?.summary}</p>
      </div>

      <div className="info-section border-none">
        <span className="info-title">{t("global.search_page.specializations")}</span>
        <p className="info-paragraph">
          {interpreter?.specializations.map(spec => {
            return <span className="info-paragraph-item">{spec.name}</span>
          })}
        </p>
      </div>

      <div className="info-section">
        <span className="info-title"> {t("global.show_interpreter.language_pairs")}</span>
        <p className="info-paragraph">
          {interpreter?.language_pairs && 
            interpreter?.language_pairs.map(langs => {
              return (
                <React.Fragment key={langs.id}>
                  <span className="info-paragraph-item">{langs.from_lang.name} - {langs.to_lang.name}</span>
                  {langs.back_interpretation && <span className="info-paragraph-item">{langs.to_lang.name} - {langs.from_lang.name}</span>}
                </React.Fragment>
              )
            })
          }
        </p>
      </div>
    </div>

  );
}