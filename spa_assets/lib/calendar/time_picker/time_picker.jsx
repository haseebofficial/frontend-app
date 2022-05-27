import "calendar/_styles/time_picker.scss";
import React, { useState } from "react";
import { parse24Hours, parse60Minutes } from "./time_parser";
import { formatTime } from "./time_formatter";

export default function TimePicker({pickedDate, forTouch=true}) {
  let {date, actions} = pickedDate;

  return (
    <div className="timepicker">
      <HoursInput pickedHours={date.getHours()} actions={actions} forTouch={forTouch}/>
        <div className="timepicker-time-delimiter">
          <div className="time-delimiter"> : </div>
        </div>
      <MinutesInput pickedMinutes={date.getMinutes()} actions={actions} forTouch={forTouch}/>
    </div>
  );
}

function HoursInput({pickedHours, actions, forTouch}) {
  let { setValues, addSameDayHours, subSameDayHours } = actions;

  let onChange = (e) => {
    let {hours, success} = parse24Hours(e.target.value);
    if (success) setValues({ hours });
  };
  let incrementHours = () => addSameDayHours(1);
  let decrementHours = () => subSameDayHours(1);

  return (
    <TimeInput 
      name="hours" 
      pickedTime={pickedHours} 
      onChange={onChange} 
      increment={incrementHours}
      decrement={decrementHours}
      forTouch={forTouch}
    />
  );
}

function MinutesInput({pickedMinutes, actions, forTouch}) {
  let { setValues, addSameHourMinutes, subSameHourMinutes } = actions;

  let onChange = (e) => {
    let {minutes, success} = parse60Minutes(e.target.value);
    if (success) setValues({ minutes });
  };
  let incrementMinutes = () => addSameHourMinutes(1);
  let decrementMinutes = () => subSameHourMinutes(1);

  return (
    <TimeInput 
      name="minutes"
      pickedTime={pickedMinutes} 
      onChange={onChange} 
      increment={incrementMinutes}
      decrement={decrementMinutes}
      forTouch={forTouch}
    />
  );
}

function TimeInput({pickedTime, onChange, increment, decrement, name, forTouch}) {
  let [shouldFormat, setShouldFormat] = useState(true);
  let value = shouldFormat ? formatTime(pickedTime) : pickedTime || '';

  return (
    <>
      {
        !forTouch
        ? <div className="timepicker-input control has-icons-right timepicker-desktop" testid={`${name}-field`}>
          <input 
            className="input"
            name={name}
            value={value} 
            placeholder="00" 
            onChange={onChange} 
            onFocus={() => setShouldFormat(false)} 
            onBlur={() => setShouldFormat(true)}
          />
          <span className="icon is-right timepicker-input-buttons">
            <span className="timepicker-input-button" onClick={increment} testid="increment">
              <i className="fas fa-chevron-up"/>
            </span>
            <span className="timepicker-input-button" onClick={decrement} testid="decrement">
              <i className="fas fa-chevron-down"/>
            </span>
          </span>
        </div>
        // +++ Для мобильной версии другой INPUT +++
        : <>
          {/* +++++++   Отображение для DESKTOP   +++++++ */}
          <div className="timepicker-input control has-icons-right timepicker-touch timepicker-for-desktop" testid={`${name}-field`}>
            <input 
              className="input"
              name={name}
              value={value} 
              placeholder="00" 
              onChange={onChange} 
              onFocus={() => setShouldFormat(false)} 
              onBlur={() => setShouldFormat(true)}
            />
            <span className="icon is-right timepicker-input-buttons">
              <span className="timepicker-input-button" onClick={increment} testid="increment">
                <i className="fas fa-chevron-up"/>
              </span>
              <span className="timepicker-input-button" onClick={decrement} testid="decrement">
                <i className="fas fa-chevron-down"/>
              </span>
            </span>
          </div>

          {/* +++++++   Отображение для TOUCH   +++++++ */}
          {/* <div className="timepicker-input control has-icons-right timepicker-touch timepicker-for-touch" testid={`${name}-field`}>
            <input 
              className="input"
              name={name}
              value={value} 
              placeholder="00" 
              onChange={onChange} 
              onFocus={() => setShouldFormat(false)} 
              onBlur={() => setShouldFormat(true)}
            />
            <span className="icon is-right timepicker-input-buttons">
              <span className="timepicker-input-button" onClick={increment} testid="increment">
                <i className="fas fa-caret-up"/>
              </span>
              <span className="timepicker-input-button" onClick={decrement} testid="decrement">
                <i className="fas fa-caret-down"/>
              </span>
            </span>
          </div> */}
          <div className="timepicker-for-touch" testid={`${name}-field`}>
            
            {/* <span className="icon is-right timepicker-input-buttons-touch"> */}
              <div>

                <span className="timepicker-input-button-touch" onClick={increment} testid="increment">
                  <i className="fas fa-chevron-up"/>
                </span>
              </div>
              <input 
                className="input"
                style={{textAlign: "center"}}
                name={name}
                value={value} 
                placeholder="00" 
                onChange={onChange} 
                onFocus={() => setShouldFormat(false)} 
                onBlur={() => setShouldFormat(true)}
              />
              <div>
                
              <span className="timepicker-input-button-touch" onClick={decrement} testid="decrement">
                <i className="fas fa-chevron-down"/>
              </span>
              </div>
            {/* </span> */}
          </div>
        </>
      }
    </>
  );
}