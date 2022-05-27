import 'client_call/_styles/form/datetime_field.scss';
import React, {useState, useRef, useEffect} from "react";
import useVisibleClickableComponent from "react_utils/use_visible_clickable_component";
import { DatePicker, TimePicker, usePickedDate } from "calendar";
import {t} from 'i18n';

export default function DatetimeField({setSchedule}) {
  let pickedDate = usePickedDate(new Date());
  let [inputValue, setInputValue] = useState("")
  // let { isVisible, toggle } = useVisible();
  let [isDateSelected, setIsDateSelected] = useState(false);
  // let pickedDate = usePickedDate(initialDate());
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

  useEffect(() => {
    setSchedule(inputValue)
  }, [inputValue])

  return (
    <div className="datetime-field-container" ref={visbilityRef}>
      {isVisible && <div className="datetime-field-fon"></div>}
      <div className="field main-field">
        <label className="label">{t("search_form.when")}</label>
        <div className="control control-date has-icons-right">
          <HiddenDateValueContainer selectedDate={selectedDate}/>
          <DatetimeInput selectedDate={selectedDate} onClick={toggle} inputValue={inputValue} setIsDateSelected={setIsDateSelected} setInputValue={setInputValue} pickedDate={pickedDate}/>
          <span className="icon is-medium is-right">
            <i className="fas fa-lg fa-calendar-alt"></i>
          </span>
        </div>
      </div>
      {isVisible &&

        <div className="datetime-field-dropdown">
          <div className="triangle"></div>
          <div className="triangle-quadrat"></div>
          <div className="dropdown-close-me">
              <a className="close-me" onClick={toggle}>×</a>
          </div>
          <DatePicker pickedDate={pickedDate} futureOnly={true}/>

          <div className="datetime-control">
            <TimePicker pickedDate={pickedDate}/>
          </div>
          <div>

          </div>
          <div className="buttons is-centered">
            <button testid="select-datetime" className="button button-yellow is-interpreters-yellow is-fullwidth" onClick={selectDate}>{t("search_form.timepicker.buttons.choose")}</button>
          </div>
        </div>
      }
    </div>
  );
}

function HiddenDateValueContainer({selectedDate}) {
  let register = useRef(null);
  let value = selectedDate ? selectedDate.toISOString() : "";

  return <input type="hidden" name="dueDate" ref={register} value={value}/>;
}

function DatetimeInput({selectedDate, onClick, inputValue, setInputValue, setIsDateSelected, pickedDate}) {
  let testid;
  if (selectedDate) {
    testid = "datetime-select";
    setInputValue(localizeDate(selectedDate))
  } else {
    testid = "datetime-select-empty";
    setInputValue("");
  }

  let selectCurrentTime = () => {
    localizeDate(pickedDate.date)
    setIsDateSelected(true)
  }

  return (
    <>
    {selectedDate != null
      ? <input 
        type="text" 
        className="input is-fullwidth"
        placeholder={t("search_form.now") + " | " + t("search_form.or_choose_a_time")}
        value={inputValue} 
        readOnly 
        testid={testid}
        onClick={onClick}
      />
      : <>
        <span className="no-change-date" onClick={selectCurrentTime}>{t("search_form.now")} </span>
          <span onClick={onClick} className="change-date">| {t("search_form.or_choose_a_time")}</span>
          <span className="icon is-medium is-right" >
            <i className="fas fa-lg fa-calendar-alt"></i>
        </span>
      </>
    }
      
    </>
  )
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