import React from "react";
import i18n, { t } from "i18n";
import { useFormContext } from "react-hook-form";
import { useLazySpecializations } from "specializations/lazy_specializations_state";

export default function SpecializationField() {
  let t = i18n.scoped("text_translations");
  let { register } = useFormContext();
  let specializations = useLazySpecializations();
  let loaderClass = specializations.isLoaded ? "" : "is-loading";

  return (
    <div className="field main-field">
      <label className="label">{t(`form.specialization`)}</label>
      <div className="control">
        <div className={`select is-fullwidth ${loaderClass}`}>
          {specializations.isLoaded ?
            <SpecializationsSelect register={register} specializations={specializations}/>
            :
            <LoadingSelect register={register}/>
          }
        </div>
      </div>
    </div>
  );
}

function SpecializationsSelect({register, specializations}) {
  return (
    <select name="specialization" ref={register({required: true})} testid="specializations-select" defaultValue="general_interest_subjects">
      <MemoizedOptions specializations={specializations.value}/>
    </select>
  );
}

function LoadingSelect({register}) {
  return (
    <select name="specialization" ref={register({required: true})} testid="specializations-select">
    </select>
  );
}

function Options({specializations}) {
  return (
    <React.Fragment>
      {specializations.map((s, i) => 
        <option key={i} value={s.slug}>{t(`specializations.${s.slug}`)}</option>
      )}
    </React.Fragment>
  );
}

let MemoizedOptions = React.memo(Options);