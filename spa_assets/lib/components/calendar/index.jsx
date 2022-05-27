import React from "react";
import { HoursSelector, MinutesSelector } from "./time_selector";
import PageBuilder from "./page_builder";

import { mergeDate } from "utils/date";

export default class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayedDate: this.props.selectedDate };
  }

  render() {
    let { onSelect, selectedDate, i18n, futureOnly } = this.props;
    let displayedDate = this.state.displayedDate;

    let page = new PageBuilder(displayedDate.getFullYear(), displayedDate.getMonth(), 
      { selectedDate, onSelect, futureOnly }
    );

    return (
      <div testid="calendar" className="datetime-selector">
        <div className="datetime-header">
          { page.canDisplayPreviousMonth() ?
            <div testid="prev-month" className="prev-month" onClick={() => this.setPreviousMonth()}/>
            :
            <div className="prev-month-placeholder"/>
          }
          <CalendarTitle date={displayedDate} i18n={i18n}/>
          <div testid="next-month" className="next-month" onClick={() => this.setNextMonth()}/>
          <div className="clear"/>
        </div>
        <table className="datetime-calendar">
          <DayNamesHeader i18n={i18n}/>
          <Days page={page}/>
        </table>
        <div className="timepicker-wrapper">
          <div className="timepicker">
            <HoursSelector date={selectedDate} onChange={onSelect}/>
            <span className="delimeter">:</span>
            <MinutesSelector date={selectedDate} onChange={onSelect}/>
          </div>
        </div>
        <div className="clear"/>
      </div>
    );
  }

  setNextMonth() {
    let displayedDate = this.state.displayedDate;
    displayedDate = mergeDate(displayedDate, { month: displayedDate.getMonth() + 1});

    this.setState({displayedDate});
  }

  setPreviousMonth() {
    let displayedDate = this.state.displayedDate;
    displayedDate = mergeDate(displayedDate, { month: displayedDate.getMonth() - 1});

    this.setState({displayedDate});
  }
}

function CalendarTitle({date, i18n}) {
  return <div className="title">
    {i18n.t(`calendar.month_names.${date.getMonth()}`)} {date.getFullYear()}
  </div>;
}

function DayNamesHeader({i18n}) {
  let names = [];
  for (let i = 0; i < 7; i++) {
    names.push(<th key={i}>{i18n.t(`calendar.day_names_min.${i}`)}</th>);
  }

  return (
    <thead>
      <tr>
        {names}
      </tr>
    </thead>
  );
}

function Days({page}) {
  let result = [];
  page.eachRow((row, i) => {
    let days = [];

    row.eachDay((day, i) => {
      days.push(<Day key={i} day={day}/>);
    });

    result.push(<tr key={i}>{days}</tr>);
  });

  return (
    <tbody>
      {result}
    </tbody>
  );
}

function Day({day}) {
  let className = [];

  if (day.isSelected) {
    className.push("selected");
  }

  if (day.isDisabled) {
    className.push("other-month");
  }

  if (day.isWeeked) {
    className.push("week-end");
  }

  className = className.join(" ");

  return <td className={className} onClick={day.select} testid={`select-day-${day.month}-${day.day}`}>{day.day}</td>;
}