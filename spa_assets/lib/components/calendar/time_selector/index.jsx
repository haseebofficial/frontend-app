import React from "react";
import { Hours, Minutes } from "./time_container";

export function HoursSelector({date, onChange}) {
  let time = new Hours({date, onChange});

  return <TimeSelector time={time} type="hour"/>;
}

export function MinutesSelector({date, onChange}) {
  let time = new Minutes({date, onChange});

  return <TimeSelector time={time} type="minute"/>;
}

function TimeSelector({time, type}) {
  return (
    <div className="time-wrapper">
      <input testid={`${type}-selector`} value={time.formattedValue} onChange={(e) => time.setValue(e.target.value)}/>
      <div className="arrows">
        <div className="arrow arrow-up" testid={`add-${type}`} onClick={() => time.addValue()}/>
        <div className="arrow arrow-down" testid={`substract-${type}`} onClick={() => time.substractValue()}/>
      </div>
    </div>
  );
}