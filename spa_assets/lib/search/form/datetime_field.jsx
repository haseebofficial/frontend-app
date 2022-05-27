import 'search/_styles/form/datetime_field.scss';
import React, { useState, useRef, useContext, useEffect } from "react";
import { ContextSearchForm } from "app/app_root"
import { addDays } from "date-fns";
import { DatePicker, TimePicker, usePickedDate } from "calendar";
import { getEndingForHours, getEndingForMinutes } from "utils/get_ending_for_time"
import { localizeDate, convertToUTC, appendLeadingZero } from "utils/localize_date"
import {t} from 'i18n';

function initialDate(hours) {
  let tomorrow = addDays(new Date(), 0);
  return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), hours, 0);
}

export default function DatetimeField({intervals, setIntervals, initialDatetimeResults, onClickSubmit}) {
  let pickedDateFrom = usePickedDate(initialDate(10));
  let pickedDateTo = usePickedDate(initialDate(18));
  let [selectButtonClick, setSelectButtonClick] = useState(false)
  let [inputValue, setInputValue] = useState([])
  let [totalTime, setTotalTime] = useState(0)
  let [time, setTime] = useState({})
  let [datetimeResults, setDatetimeResults] = useState(initialDatetimeResults || []);
  let {isDateVisible, toggleDateVisible} = useContext(ContextSearchForm)
  const resultScrollBottomRef = useRef()
  const resultScrollWrapperRef = useRef()

  useEffect(() => {
    if(initialDatetimeResults) {
      let times = 0
      for(let i = 0; initialDatetimeResults.length > i; i++) {
        times += initialDatetimeResults[i].timeHoursTo*60 + initialDatetimeResults[i].timeMinutesTo - initialDatetimeResults[i].timeHoursFrom*60 - initialDatetimeResults[i].timeMinutesFrom
      }
      setTotalTime(times)
    }
  }, [])

  useEffect(() => {
    if(selectButtonClick || initialDatetimeResults) {
      setInputValue(getIntervalsStringArray(datetimeResults))
      setIntervals(getIntervalObject(datetimeResults))
    }
  }, [datetimeResults])

  useEffect(() => {
    setTime({
      hours: getHorsAndMinutes(totalTime).totalHours,
      minutes: getHorsAndMinutes(totalTime).totalMinutes
    })
  }, [totalTime])
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  function scrollToBlockBottom (elementRef, wrapperRef) {
    let wrapperBottomPosition = wrapperRef.current.getBoundingClientRect().bottom
    let contentBottomPosition = elementRef.current.getBoundingClientRect().bottom + 27
    let scrollCount = Math.trunc(contentBottomPosition - wrapperBottomPosition)

    function setScrollBy (delta) {
      wrapperRef.current.scrollBy({top: delta})
    }

    for (let i = 0; i <= scrollCount; i++) {
      setTimeout(() => setScrollBy(1), Math.abs(360/(scrollCount-15)) * i)
    }
  }

  const addDatetime = () => {
    let date = localizeDate(pickedDateFrom.date).date
    let year = localizeDate(pickedDateFrom.date).year
    let month = localizeDate(pickedDateFrom.date).month
    let day = localizeDate(pickedDateFrom.date).day
    let timeHoursFrom = localizeDate(pickedDateFrom.date).hours
    let timeHoursTo = localizeDate(pickedDateTo.date).hours
    let timeMinutesFrom = localizeDate(pickedDateFrom.date).minutes
    let timeMinutesTo = localizeDate(pickedDateTo.date).minutes
    let newTime = ((timeHoursTo * 60) + timeMinutesTo) - ((timeHoursFrom * 60) + timeMinutesFrom)
    let totalSecondsFrom = pickedDateFrom.date.getTime()
    let totalSecondsTo = totalSecondsFrom + (newTime * 60 * 1000)
    let currentTime = Date.now()

    let selectedPeriod = {
      id: Date.now(),
      year, month, day,
      timeHoursFrom, timeMinutesFrom,
      timeHoursTo, timeMinutesTo,
      time: newTime,
      selectTimeString: `${date} - ${t("layout.date.from")} ${appendLeadingZero(timeHoursFrom)}:${appendLeadingZero(timeMinutesFrom)} ${t("layout.date.to")} ${appendLeadingZero(timeHoursTo)}:${appendLeadingZero(timeMinutesTo)}`, 
      totalSecondsFrom,
      totalSecondsTo,
      newInterval: {
        since: `${year}-${month}-${day} ${timeHoursFrom}:${timeMinutesFrom}`,
        to: `${year}-${month}-${day} ${timeHoursTo}:${timeMinutesTo}`
      }
    }
  
    const validInterval = getValidIntervals(datetimeResults, selectedPeriod)

    if (totalSecondsFrom > currentTime) {
      if (newTime > 0) {
        if (validInterval) {
          setTotalTime(totalTime + newTime)
          setDatetimeResults([...datetimeResults, selectedPeriod])
        } else {
          alert(t("search_form.js.date_selector.errors.interval_exists"))
        }
      } else {
        alert(t("search_form.js.date_selector.errors.invalid_interval"))
      }
    } else {
      alert(t("search_form.js.date_selector.errors.interval_passed"))
    }

    if (window.innerWidth <= 1024) {
      setTimeout(() => scrollToBlockBottom(resultScrollBottomRef, resultScrollWrapperRef), 90)
    }
  }
  const removeDatetime = (datetime) => {
    setDatetimeResults(datetimeResults.filter(date => date.id !== datetime.id))
    setTotalTime(totalTime - datetime.time)
  }
  const addIntervals = (e) => {
    e.preventDefault()
    setSelectButtonClick(true)
    setInputValue(getIntervalsStringArray(datetimeResults))
    setIntervals(getIntervalObject(datetimeResults))
    toggleDateVisible()
  }
  // ===========================================================================
  return (
    <div className="datetime-field-container">
      {isDateVisible && <div className="datetime-field-fon"></div>}
      <div className="field main-field">
        <label className="label">{t("search_form.when")} 
          { onClickSubmit && intervals.length == 0 &&
            <span className="label-error"> {t("search_form.js.search.errors.blank_intervals")}</span>}
        </label>
        <div className="control has-icons-right">
          <input type="text" readOnly className="input is-fullwidth" placeholder={t("search_form.date_time")} onClick={toggleDateVisible} value={inputValue.join(",  ")}/>
          <span className="icon is-medium is-right">
            <i className="fas fa-lg fa-calendar-alt"></i>
          </span>
        </div>
      </div>
      {isDateVisible &&
        <div className="datetime-field-dropdown">
          <div className="triangle"></div>
          <div className="triangle-quadrat"></div>
            <div className="datetime-field-dropdown_body">  
            <div className="datetime-field-dropdown_top">
              <a className="close-me" onClick={toggleDateVisible}>×</a>
            </div>
              <div className="datetime-field-dropdown_left">
                <DatePicker pickedDate={pickedDateFrom} futureOnly={true}/>  
              </div>
              <div className="datetime-field-dropdown_right">
                <div className="datetime-control">
                  <div className="datetime-control-title"> {t("search_form.timepicker.title")} </div>
                  <div className="time-container time-container-first">
                    <div className="time-container-from">{t("search_form.timepicker.from")}</div>
                    <TimePicker pickedDate={pickedDateFrom} className="column "/>
                  </div>
                  <div className="time-container">
                    <div className="time-container-to">{t("search_form.timepicker.till")}</div>
                    <TimePicker pickedDate={pickedDateTo} className="column "/>
                  </div>

                  <div className="buttons is-centered">
                    <div testid="select-datetime" className="button is-fullwidth" onClick={addDatetime}>{datetimeResults.length > 0 ? t("search_form.timepicker.buttons.add_day") : t("search_form.timepicker.buttons.choose")}</div>
                  </div>
                </div>
              </div>
            </div>
            {
              datetimeResults.length != 0 &&
              <div className="datetime-field-dropdown_bottom">
                <div className="datetime-result">
                  {/* <span className="datetime-result-title">Общее время  - 8 часов 00 минут</span> */}
                  <span className="datetime-result-title">{t("search_form.js.date_selector.total_time")} {time.hours} {getEndingForHours(time.hours)} {appendLeadingZero(time.minutes)} {getEndingForMinutes(time.minutes)}</span>
                </div>
                <div ref={resultScrollWrapperRef} className="datetime-result-wrapper">
                  <div className="datetime-result-scroll">
                    {datetimeResults.map((res) => {
                      return <DatetimeResult key={res.id} res={res} selectTimeString={res.selectTimeString} remove={removeDatetime} />
                    })}
                  <div ref={resultScrollBottomRef}></div>
                  </div>
                </div>
                <button testid="select-datetime" className="button is-interpreters-yellow is-fullwidth" onClick={addIntervals}> {t("search_form.js.buttons.confirm_order_date")} </button>
              </div>
            }
        </div>
      }
    </div>
  );
}

function DatetimeResult ({res, remove, selectTimeString}) {
  return (
    <div className="datetime-result">
      <a className="datetime-result-delete" onClick={() => remove(res)}>×</a>
      <span className="datetime-result-subtitle">{selectTimeString}</span>
    </div>
  )
}

function getHorsAndMinutes(time) {
  let totalHours, totalMinutes
  totalMinutes = (time % 60)
  totalHours = (time - totalMinutes) / 60
  return {totalHours, totalMinutes}
}

function getValidIntervals(mas, el) {
  if (mas.length > 0) {
    for (let i = 0; i < mas.length; i++) {
      let invalidFrom = (el.totalSecondsFrom >= mas[i].totalSecondsFrom && el.totalSecondsFrom < mas[i].totalSecondsTo)
      let invalidTo = (el.totalSecondsTo > mas[i].totalSecondsFrom && el.totalSecondsTo <= mas[i].totalSecondsTo)
      if(invalidFrom || invalidTo) {
        return false
      }
    }
    return true
  } else {
    return true
  }
}

function getIntervalsStringArray(array) {
  let newArray = []
  array.map(ar => {
    newArray.push(ar.selectTimeString)
  })
  return newArray
}
function getIntervalObject(array) {
  let newArray = []
  array.map(ar => {
    return newArray.push(ar.newInterval)
  })
  return newArray
}