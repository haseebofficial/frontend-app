import React from "react";
import { useLocation } from "react-router-dom";
import { useLazyLanguages } from "languages/lazy_languages_state";
import { getAppLocale, t } from "i18n";
import { useFormContext } from "react-hook-form";
import { setInitialValue, changeValue } from "form_utils/diametric_input_pair";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function SourceLanguageField({diametricInput}) {
  let query = useQuery();
  let sourceLanguage = query.get("source_language");
  let targetLanguage = query.get("target_language");
  let currentLocale = getAppLocale();

  let initialValue;
  if (sourceLanguage && sourceLanguage !== targetLanguage) {
    initialValue = sourceLanguage;
  } else {
    initialValue = currentLocale;
  }

  let getInitialValue = () => initialValue;

  return <LanguageField 
    name="sourceLanguage" 
    testid="source-lang-select" 
    getInitialValue={getInitialValue}
    diametricInput={diametricInput}
  />;
}

export function TargetLanguageField({diametricInput}) {
  let query = useQuery();
  let targetLanguage = query.get("target_language");

  let currentLocale = getAppLocale();
  let getInitialValue = (allLanguages) => {
    return targetLanguage || allLanguages.find(l => l.locale !== currentLocale).locale;
  };

  return <LanguageField 
    name="targetLanguage" 
    testid="target-lang-select" 
    getInitialValue={getInitialValue}
    diametricInput={diametricInput}
  />;
}

export function LanguageField({name, testid, getInitialValue, diametricInput}) {
  let languages = useLazyLanguages();

  return (
    <div className="field main-field">
      <label className="label">{t(`text_translations.form.languages.${name}`)}</label>
      <div className="control">
        {languages.isLoaded ? 
          <LanguageSelect 
            name={name} 
            languages={languages.value}
            testid={testid} 
            getInitialValue={getInitialValue}
            diametricInput={diametricInput}
          /> :
          <LoadingSelect name={name}/>
        }
      </div>
    </div>
  );
}

function LanguageSelect({name, languages, testid, getInitialValue, diametricInput}) {
  let { register } = useFormContext();
  let { value, dispatch } = diametricInput;

  let initialValue = getInitialValue(languages);
  dispatch(setInitialValue(initialValue));

  let onChange = (e) => {
    dispatch(changeValue(e.target.value));
  };

  return (
    <div className="select is-fullwidth">
      <select name={name} testid={testid} ref={register({required: true})} value={value} onChange={onChange}>
        <MemoizedOptions languages={languages}/>
      </select>
    </div>
  );
}

function Options({languages}) {
  return (
    <React.Fragment>
      {languages.map(({locale}, i) => 
        <option value={locale} key={i}>{t(`languages.${locale}`)}</option>
      )}
    </React.Fragment>
  );
}

let MemoizedOptions = React.memo(Options);

function LoadingSelect({name}) {
  let { register } = useFormContext();

  return (
    <div className="select is-fullwidth is-loading">
      <select name={name} ref={register({required: true})}>
      </select>
    </div>
  );
}