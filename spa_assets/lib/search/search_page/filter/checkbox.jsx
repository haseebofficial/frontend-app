import 'search/_styles/search_page/filter/checkbox.scss';
import React from "react";

export default function Checkbox() {
  return (
    <div>
      <label className="label-checkbox">
        Перевод экскурсий, услуги гида
        <input type="checkbox" />
        <span className="checkmark"/>
      </label>

      <label className="label-checkbox">
        Переводчик пресс-конференций
        <input type="checkbox" />
        <span className="checkmark"/>
      </label>
    </div>
  );

}

export function ServiceCheckbox({service}) {
  return (
    <label className="label-checkbox">
        {service.name}
        <input type="checkbox" />
        <span className="checkmark"/>
    </label>
  )
}

export function SpecializationsCheckbox({specialization}) {
  return (
    <label className="label-checkbox">
        {specialization.name}
        <input type="checkbox" />
        <span className="checkmark"/>
    </label>
  )
}
