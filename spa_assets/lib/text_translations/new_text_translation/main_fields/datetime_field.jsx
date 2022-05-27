import "text_translations/_styles/new_text_translation/main_fields/datetime_field.scss";
import React, {useState} from "react";
import i18n from "i18n";
import useVisibleClickableComponent from "react_utils/use_visible_clickable_component";
import { addDays } from "date-fns";
import { useFormContext } from "react-hook-form";
import { DatePicker, TimePicker, usePickedDate } from "calendar";

function initialDate() {
  let tomorrow = addDays(new Date(), 1);
  return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0);
}

export default function DatetimeField() {
  let t = i18n.scoped("text_translations.form");
  let [isDateSelected, setIsDateSelected] = useState(false);
  let pickedDate = usePickedDate(initialDate());
  let selectedDate = isDateSelected ? pickedDate.date : null;

  let {isVisible, ref: visbilityRef, toggle, hide} = useVisibleClickableComponent(false);

  let selectDate = () => {
    hide();
    setIsDateSelected(true);
  };
  let resetDate = () => {
    hide();
    setIsDateSelected(false);
  };

  return (
    <div className="datetime-field-container" ref={visbilityRef}>
      {isVisible && <div className="datetime-field-fon"></div>}
      <div className="field main-field">
        <label className="label">{t("due_date.label")}</label>
        <div className="control has-icons-right">
          <HiddenDateValueContainer selectedDate={selectedDate}/>
          <DatetimeInput selectedDate={selectedDate} onClick={toggle}/>
          <span className="icon is-medium is-right">
            <i className="fas fa-lg fa-calendar-alt"></i>
          </span>
        </div>
      </div>
      {isVisible && 
        <div className="datetime-field-dropdown">
          <div className="triangle"></div>
          <div className="triangle-quadrat"></div>
          <a className="close-me" onClick={toggle}>×</a>
          <DatePicker pickedDate={pickedDate} futureOnly={true}/>
          <div className="time-container">

          <TimePicker pickedDate={pickedDate}/>
          </div>
          <div className="buttons is-centered">
            {selectedDate &&
              <div testid="reset-datetime" className="button" onClick={resetDate}>{t("due_date.reset")}</div>
            }
            <div testid="select-datetime" className="button is-interpreters-yellow" onClick={selectDate}>{t("due_date.select")}</div>
          </div>
        </div>
      }
    </div>
  );
}

function HiddenDateValueContainer({selectedDate}) {
  let { register } = useFormContext();
  let value = selectedDate ? selectedDate.toISOString() : "";

  return <input type="hidden" name="dueDate" ref={register} value={value}/>;
}

function DatetimeInput({selectedDate, onClick}) {
  let t = i18n.scoped("text_translations.form");

  let testid, value;
  if (selectedDate) {
    testid = "datetime-select";
    value = localizeDate(selectedDate);
  } else {
    testid = "datetime-select-empty";
    value = "";
  }

  return <input 
    type="text" 
    className="input is-fullwidth"
    placeholder={t("due_date.auto")}
    value={value} 
    readOnly 
    testid={testid}
    onClick={onClick}
  />;
}

function localizeDate(date) {
  let month = appendLeadingZero(date.getMonth() + 1);
  let day = appendLeadingZero(date.getDate());
  let hours = appendLeadingZero(date.getHours());
  let minutes = appendLeadingZero(date.getMinutes());
  
  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
}

function appendLeadingZero(i) {
  return i < 10 ? `0${i}` : i;
}